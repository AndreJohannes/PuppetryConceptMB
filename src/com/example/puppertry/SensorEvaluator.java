package com.example.puppertry;

import java.util.Locale;

import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.widget.TextView;

public class SensorEvaluator implements SensorEventListener {

	private final SensorManager sensorManager;
	private final Sensor magneticSensor, accelerationSensor;
	private final WebSocketServer webSocketServer;
	private final CommandDispatcher commandDispatcher;
	private TextView otX, otY, otZ;
	private float linearAcceleration;
	private float[] otArray = new float[3], rotationMatrix = new float[9];
	private float[] accel = new float[3], mag = new float[3], daccel = new float[3];
	private float ortX, ortY, ortZ, ortXOffset = 0;
	private static float alpha = 0.5f;
	private long time;

	public SensorEvaluator(Activity activity, WebSocketServer webSocketServer, CommandDispatcher commandDispatcher) {
		this.webSocketServer = webSocketServer;
		this.commandDispatcher = commandDispatcher;
		sensorManager = (SensorManager) activity.getSystemService(activity.SENSOR_SERVICE);
		magneticSensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
		if (magneticSensor != null) {
			sensorManager.registerListener(this, magneticSensor, SensorManager.SENSOR_DELAY_UI);
		}
		accelerationSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
		if (accelerationSensor != null) {
			sensorManager.registerListener(this, accelerationSensor, SensorManager.SENSOR_DELAY_UI);
		}
		otX = (TextView) activity.findViewById(R.id.OrtX);
		otY = (TextView) activity.findViewById(R.id.OrtY);
		otZ = (TextView) activity.findViewById(R.id.OrtZ);
	}

	@Override
	public void onAccuracyChanged(Sensor arg0, int arg1) {
		// TODO Auto-generated method stub
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		float[] inputArray = event.values;
		switch (event.sensor.getType()) {
		case Sensor.TYPE_MAGNETIC_FIELD:
			mag[0] = inputArray[0] + alpha * (mag[0] - inputArray[0]);
			mag[1] = inputArray[1] + alpha * (mag[1] - inputArray[1]);
			mag[2] = inputArray[2] + alpha * (mag[2] - inputArray[2]);
			return;
		case Sensor.TYPE_ACCELEROMETER:
			float[] accelOld = accel.clone();
			accel[0] = inputArray[0] + alpha * (accel[0] - inputArray[0]);
			accel[1] = inputArray[1] + alpha * (accel[1] - inputArray[1]);
			accel[2] = inputArray[2] + alpha * (accel[2] - inputArray[2]);
			linearAcceleration = (float) (Math.signum(accel[2])
					* Math.sqrt(accel[0] * accel[0] + accel[1] * accel[1] + accel[2] * accel[2]));
			long timeOld = time;
			time = System.currentTimeMillis();
			float dTime = (time - timeOld);
			float DaccelX = (accel[0] - accelOld[0]) / dTime;
			float DaccelY = (accel[1] - accelOld[1]) / dTime;
			float DaccelZ = (accel[2] - accelOld[2]) / dTime;
			daccel[0] = DaccelX + (alpha + 0.2f) * (daccel[0] - DaccelX);
			daccel[1] = DaccelY + (alpha + 0.2f) * (daccel[1] - DaccelY);
			daccel[2] = DaccelZ + (alpha + 0.2f) * (daccel[2] - DaccelZ);
			break;
		}
		boolean success = SensorManager.getRotationMatrix(rotationMatrix, null, accel, mag);
		if (success) {
			SensorManager.getOrientation(rotationMatrix, otArray);
			// ortX = otArray[0] + alpha * applyOffset(ortX - otArray[0], 0);
			ortY = otArray[1];// + alpha * (ortY - otArray[1]);
			float ortZ_old = ortZ;
			ortZ = otArray[2];// + alpha * (ortZ - otArray[2]);
			// if (Math.abs(ortZ_old - ortZ) < 0.05)
			// if (Math.sqrt(daccel[0] * daccel[0] + daccel[2] * daccel[2]) <
			// 0.005)
			float alpha2 = (float) (0.5
					* (1. + Math.tanh(900 * (Math.sqrt(daccel[0] * daccel[0] + daccel[2] * daccel[2]) - 0.005))));
			ortX = otArray[0] + alpha2 * applyOffset(ortX - otArray[0], 0);
			commandDispatcher.setEuler(applyOffset(ortX, ortXOffset), -ortY, ortZ);
			commandDispatcher.setLinearAcceleration(linearAcceleration - 10.);
			commandDispatcher.sendCommand();

			// long time = System.currentTimeMillis();
			// float accel = (float) Math
			// .sqrt(acArray[0] * acArray[0] + acArray[1] * acArray[1] +
			// acArray[2] * acArray[2]);
			// webSocketServer.broadcast(String.format(Locale.ENGLISH, "[%f, %f,
			// %f, %f, %f, %f,%f,%f,%f, %d]",
			// applyOffset(ortX, ortXOffset), -ortY, ortZ, accel[0], accel[1],
			// accel[2], daccel[0], daccel[1],
			// daccel[2], time));
			otX.setText(String.format("%.3f", applyOffset(ortX, ortXOffset)));
			otY.setText(String.format("%.3f", ortY));
			otZ.setText(String.format("%.3f", ortZ));
		}
	}

	public void setOffset() {
		ortXOffset = ortX;
	}

	public void unregister() {
		if (magneticSensor != null || accelerationSensor != null) {
			sensorManager.unregisterListener(this);
		}
	}

	private float applyOffset(float ortX, float ortXOffset) {
		// TODO: can be improved!?
		float a = (ortX - ortXOffset);
		float b = (float) (2 * Math.PI);
		float retValue = (a % b + b) % b;
		return (float) (retValue > Math.PI ? retValue - 2 * Math.PI : retValue);
	}

}

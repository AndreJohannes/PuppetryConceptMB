package com.example.puppertry;

import com.example.puppertry.helpers.KalmanFilter;
import com.example.puppertry.helpers.KalmanFilter.Matrix;

import android.app.Activity;
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
	private float accX, accY, accZ = 0;
	private final KalmanFilter kalmanTurnFilter;
	private final KalmanFilter kalmanOrientationFilter;
	private final KalmanFilter kalmanAccelerationFilter;
	private long time;
	private double accelerationOffset = 10;
	private double alpha = 0;

	public SensorEvaluator(Activity activity, WebSocketServer webSocketServer, CommandDispatcher commandDispatcher) {
		this.kalmanOrientationFilter = getKalmanFilterForOrientation();
		this.kalmanAccelerationFilter = getKalmanFilterForAcceleration();
		this.kalmanTurnFilter = getKalmanFilterForTurn();
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
			mag = inputArray;
			return;
		case Sensor.TYPE_ACCELEROMETER:
			float[] accelOld = accel.clone();
			accel = inputArray;
			long timeOld = time;
			time = System.currentTimeMillis();
			float dTime = (time - timeOld);
			float DaccelX = (accel[0] - accelOld[0]) / dTime;
			float DaccelY = (accel[1] - accelOld[1]) / dTime;
			float DaccelZ = (accel[2] - accelOld[2]) / dTime;
			daccel[0] = DaccelX + (0.5f) * (daccel[0] - DaccelX);
			daccel[1] = DaccelY + (0.5f) * (daccel[1] - DaccelY);
			daccel[2] = DaccelZ + (0.5f) * (daccel[2] - DaccelZ);
			break;
		}
		boolean success = SensorManager.getRotationMatrix(rotationMatrix, null, accel, mag);
		if (success) {
			SensorManager.getOrientation(rotationMatrix, otArray);

			KalmanFilter.Vector state = kalmanOrientationFilter
					.step(new KalmanFilter.Vector(new double[] { otArray[0], otArray[1], otArray[2] }));
			ortX = (float) (state.getValue(0) - alpha * kalmanOrientationFilter.getCurrentState().getValue(5));
			ortY = (float) state.getValue(1);
			ortZ = (float) state.getValue(2);

			double x = otArray[0];

			kalmanTurnFilter.setCurrentState(1, 0);
			state = kalmanTurnFilter.step(new KalmanFilter.Vector(new double[] { x }));
			ortX = (float) state.getValue(0);


			state = kalmanAccelerationFilter
					.step(new KalmanFilter.Vector(new double[] { accel[0], accel[1], accel[2] }));
			accX = (float) state.getValue(0);
			accY = (float) state.getValue(1);
			accZ = (float) state.getValue(2);

			linearAcceleration = (float) Math.sqrt(accX * accX + accY * accY + accZ * accZ);

			commandDispatcher.setEuler(ortX, -ortY, ortZ);
			commandDispatcher.setLinearAcceleration(linearAcceleration - this.accelerationOffset);
			commandDispatcher.setAccelerations(accX, accY, accZ);
			commandDispatcher.sendCommand();

			otX.setText(String.format("%.3f", ortX));
			otY.setText(String.format("%.3f", ortY));
			otZ.setText(String.format("%.3f", ortZ));
		}
	}

	public void setCalibrationOffset() {
		ortXOffset = ortX;
	}

	public void setAccelerationOffset(double value) {
		this.accelerationOffset = value;
	}

	public void setAlpha(double value) {
		double scale = Math.exp(Math.log(10d) * value);
		alpha = 4d * (value - 1.5);
		// Matrix R = KalmanFilter.Matrix.eye(3).scale(scale);
		// this.kalmanOrientationFilter.setR(R);
	}

	public void setBeta(double value) {
		double scale = Math.exp(Math.log(10d) * value);
		this.kalmanAccelerationFilter.setR(KalmanFilter.Matrix.eye(3).scale(scale));
	}

	public void unregister() {
		if (magneticSensor != null || accelerationSensor != null) {
			sensorManager.unregisterListener(this);
		}
	}

	private double applyOffset(double ortX, double ortXOffset) {
		// TODO: can be improved!?
		double a = (ortX - ortXOffset);
		double b = (float) (2 * Math.PI);
		double retValue = (a % b + b) % b;
		return (retValue > Math.PI ? retValue - 2 * Math.PI : retValue);
	}

	private double mirrorAngle(double angle) {
		if (angle < Math.PI / 2f && angle > -Math.PI / 2f)
			return angle;
		if (angle < Math.PI)
			return Math.PI - angle;
		if (angle > -Math.PI)
			return -Math.PI - angle;
		throw new RuntimeException("How did you get here ?");
	}

	private KalmanFilter getKalmanFilterForTurn() {
		KalmanFilter.Matrix A = new KalmanFilter.Matrix(2, 2);
		A.setValue(0, 0, 1);
		A.setValue(0, 1, 1);
		A.setValue(1, 1, 1);
		KalmanFilter.Matrix B = new KalmanFilter.Matrix(2, 2);
		KalmanFilter.Matrix H = new KalmanFilter.Matrix(1, 2);
		H.setValue(0, 0, 1);
		KalmanFilter.Matrix Q = KalmanFilter.Matrix.eye(2).scale(1);
		KalmanFilter.Matrix R = KalmanFilter.Matrix.eye(1).scale(2000);
		KalmanFilter.Matrix P = KalmanFilter.Matrix.eye(2).scale(10);
		KalmanFilter.Vector x = new KalmanFilter.Vector(new double[] { 0, 0 });
		return new KalmanFilter(A, Q, H, R, x, P);
	}

	private KalmanFilter getKalmanFilterForOrientation() {
		KalmanFilter.Matrix A = new KalmanFilter.Matrix(6, 6);
		A.setValue(0, 0, 1);
		A.setValue(0, 3, 1);
		A.setValue(1, 1, 1);
		A.setValue(1, 4, 1);
		A.setValue(2, 2, 1);
		A.setValue(2, 5, 1);
		A.setValue(3, 3, 1);
		A.setValue(4, 4, 1);
		A.setValue(5, 5, 1);
		KalmanFilter.Matrix B = new KalmanFilter.Matrix(6, 6);
		KalmanFilter.Matrix H = new KalmanFilter.Matrix(3, 6);
		H.setValue(0, 0, 1);
		H.setValue(1, 1, 1);
		H.setValue(2, 2, 1);
		KalmanFilter.Matrix Q = KalmanFilter.Matrix.eye(6).scale(1);
		KalmanFilter.Matrix R = KalmanFilter.Matrix.eye(3).scale(100);
		KalmanFilter.Matrix P = KalmanFilter.Matrix.eye(6).scale(10);
		KalmanFilter.Vector x = new KalmanFilter.Vector(new double[] { 0, 0, 0, 0, 0, 0 });
		return new KalmanFilter(A, Q, H, R, x, P);
	}

	private KalmanFilter getKalmanFilterForAcceleration() {
		KalmanFilter.Matrix A = new KalmanFilter.Matrix(6, 6);
		A.setValue(0, 0, 1);
		A.setValue(0, 3, 1);
		A.setValue(1, 1, 1);
		A.setValue(1, 4, 1);
		A.setValue(2, 2, 1);
		A.setValue(2, 5, 1);
		A.setValue(3, 3, 1);
		A.setValue(4, 4, 1);
		A.setValue(5, 5, 1);
		KalmanFilter.Matrix B = new KalmanFilter.Matrix(6, 6);
		KalmanFilter.Matrix H = new KalmanFilter.Matrix(3, 6);
		H.setValue(0, 0, 1);
		H.setValue(1, 1, 1);
		H.setValue(2, 2, 1);
		KalmanFilter.Matrix Q = KalmanFilter.Matrix.eye(6).scale(1);
		KalmanFilter.Matrix R = KalmanFilter.Matrix.eye(3).scale(100);
		KalmanFilter.Matrix P = KalmanFilter.Matrix.eye(6).scale(10);
		KalmanFilter.Vector x = new KalmanFilter.Vector(new double[] { 0, 0, 0, 0, 0, 0 });
		return new KalmanFilter(A, Q, H, R, x, P);
	}

}

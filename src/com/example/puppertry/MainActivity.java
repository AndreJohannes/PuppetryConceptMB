package com.example.puppertry;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Locale;

import NanoHTTPD.NanoHTTPD;
import NanoHTTPD.NanoWSD;
import NanoHTTPD.NanoWSD.WebSocket;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.text.format.Formatter;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

public class MainActivity extends Activity implements SensorEventListener {

	private SensorManager sensorManager;
	private final WebSocketServer webSocketServer = WebSocketServer.getInstance();
	private final NanoHTTPD httpServer = HTTPServer.getInstance(this);
	private Sensor magneticSensor, accelerationSensor;
	private TextView mfX, mfY, mfZ;
	private TextView acX, acY, acZ;
	private TextView otX, otY, otZ;
	private float[] mfArray = new float[3], acArray = new float[3], otArray = new float[3];
	private float[] rotationMatrix = new float[9];
	private float ortX, ortY, ortZ;
	private static float alpha = 0.5f; 
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		mfX = (TextView) findViewById(R.id.MagFieldX);
		mfY = (TextView) findViewById(R.id.MagFieldY);
		mfZ = (TextView) findViewById(R.id.MagFieldZ);
		acX = (TextView) findViewById(R.id.AccX);
		acY = (TextView) findViewById(R.id.AccY);
		acZ = (TextView) findViewById(R.id.AccZ);
		otX = (TextView) findViewById(R.id.OrtX);
		otY = (TextView) findViewById(R.id.OrtY);
		otZ = (TextView) findViewById(R.id.OrtZ);
		WifiManager wm = (WifiManager) getSystemService(WIFI_SERVICE);
		String ip = Formatter.formatIpAddress(wm.getConnectionInfo().getIpAddress());
		((TextView) findViewById(R.id.IP)).setText("IP: " + ip);

		try {
			if (!webSocketServer.wasStarted())
				webSocketServer.start(1000000);
			if (!httpServer.wasStarted())
				httpServer.start();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
		magneticSensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
		if (magneticSensor != null) {
			sensorManager.registerListener(this, magneticSensor, SensorManager.SENSOR_DELAY_UI);
		}
		accelerationSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
		if (accelerationSensor != null) {
			sensorManager.registerListener(this, accelerationSensor, SensorManager.SENSOR_DELAY_UI);
		}

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		if (magneticSensor != null || accelerationSensor != null) {
			sensorManager.unregisterListener(this);
		}
		// webSocketServer.stop();
		// httpServer.stop();
	}

	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		// TODO Auto-generated method stub
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		switch (event.sensor.getType()) {
		case Sensor.TYPE_MAGNETIC_FIELD:
			mfArray = event.values;
			mfX.setText(String.valueOf(event.values[0]));
			mfY.setText(String.valueOf(event.values[1]));
			mfZ.setText(String.valueOf(event.values[2]));
			break;
		case Sensor.TYPE_ACCELEROMETER:
			acArray = event.values;
			acX.setText(String.valueOf(event.values[0]));
			acY.setText(String.valueOf(event.values[1]));
			acZ.setText(String.valueOf(event.values[2]));
			break;
		}
		boolean success = SensorManager.getRotationMatrix(rotationMatrix, null, acArray, mfArray);
		if (success) {
			SensorManager.getOrientation(rotationMatrix, otArray);
			ortX = otArray[0] + alpha *(ortX - otArray[0]);
			ortY = otArray[1] + alpha *(ortY - otArray[1]);
			ortZ = otArray[2] + alpha *(ortZ - otArray[2]);
			webSocketServer
			.broadcast(String.format(Locale.ENGLISH, "[%f, %f, %f]", ortX, ortY, ortZ));
			otX.setText(String.valueOf(ortX));
			otY.setText(String.valueOf(ortY));
			otZ.setText(String.valueOf(ortZ));
		}
	}
}

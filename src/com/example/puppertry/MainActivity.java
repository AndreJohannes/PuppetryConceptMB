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
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends Activity {

	private CommandDispatcher commandDispatcher;
	private SensorEvaluator sensorEvaluator;
	private ButtonsController buttonsController;
	private final WebSocketServer webSocketServer = WebSocketServer.getInstance();
	private final NanoHTTPD httpServer = HTTPServer.getInstance(this);

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
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

		commandDispatcher = new CommandDispatcher(webSocketServer);
		sensorEvaluator = new SensorEvaluator(this, webSocketServer, commandDispatcher);
		buttonsController = new ButtonsController(this, sensorEvaluator, commandDispatcher);

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
		sensorEvaluator.unregister();
		// webSocketServer.stop();
		// httpServer.stop();
	}

}

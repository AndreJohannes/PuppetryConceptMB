package com.example.puppertry;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;

import NanoHTTPD.NanoHTTPD;
import android.annotation.SuppressLint;
import android.content.Context;

public class HTTPServer extends NanoHTTPD {

	private Context context;
	private static HTTPServer instance = null;
	
	public static HTTPServer getInstance(Context context){
		if(instance == null)
			instance = new HTTPServer(context);
		return instance;
	}
	
	private HTTPServer(Context context) {
		super(8080);
		this.context = context;
	}

	@SuppressLint("NewApi")
	@Override
	public Response serve(IHTTPSession session) {
		Method method = session.getMethod();
		String uriString = session.getUri();

		URI uri = URI.create(uriString);
		String msg = getStringOfFile(uri.getPath());
		return newFixedLengthResponse(msg);
	}

	private String getStringOfFile(String file) {
		StringBuilder buf = new StringBuilder();
		InputStream fileStream;
		try {
			fileStream = context.getAssets().open(file.toLowerCase().substring(1,file.length()));
			BufferedReader in = new BufferedReader(new InputStreamReader(fileStream, "UTF-8"));
			String str;

			while ((str = in.readLine()) != null) {
				buf.append(str).append(System.getProperty("line.separator"));
			}

			in.close();
		} catch (IOException e) {
			buf = new StringBuilder("File not found: ").append(file);
			e.printStackTrace();
		}

		return buf.toString();
	}

}
package com.example.puppertry;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;

import javax.net.ssl.SSLEngineResult.Status;

import NanoHTTPD.NanoHTTPD;
import NanoHTTPD.NanoHTTPD.Response.IStatus;
import android.annotation.SuppressLint;
import android.content.Context;

public class HTTPServer extends NanoHTTPD {

	private Context context;
	private static HTTPServer instance = null;
	public static final String MIME_PLAINTEXT = "text/plain", MIME_HTML = "text/html",
			MIME_JS = "application/javascript", MIME_CSS = "text/css", MIME_JPG = "image/jpg",
			MIME_DEFAULT_BINARY = "application/octet-stream", MIME_XML = "text/xml", MIME_AUDIO = "audio/mpeg";

	public static HTTPServer getInstance(Context context) {
		if (instance == null)
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

		if (uriString.contains(".jpg")) {
			InputStream mbuffer;
			try {
				mbuffer = context.getAssets().open(uriString.substring(1));
				return newChunkedResponse(NanoHTTPD.Response.Status.OK, MIME_JPG, mbuffer);

			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// HTTP_OK = "200 OK" or HTTP_OK = Status.OK;(check comments)
		}else if(uriString.contains(".mp3")) {
			InputStream mbuffer;
			try {
				mbuffer = context.getAssets().open(uriString.substring(1));
				return newChunkedResponse(NanoHTTPD.Response.Status.OK, MIME_AUDIO, mbuffer);

			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// HTTP_OK = "200 OK" or HTTP_OK = Status.OK;(check comments)
		}

		URI uri = URI.create(uriString);
		String msg = getStringOfFile(uri.getPath());
		return newFixedLengthResponse(msg);
	}

	private String getStringOfFile(String file) {
		StringBuilder buf = new StringBuilder();
		InputStream fileStream;
		try {
			fileStream = context.getAssets().open(file.substring(1, file.length()));
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
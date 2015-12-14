package com.example.puppertry;

import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.logging.Level;
import java.util.logging.Logger;

import NanoHTTPD.NanoWSD;
import NanoHTTPD.NanoWSD.WebSocketFrame.CloseCode;

public class WebSocketServer extends NanoWSD {

	/**
	 * logger to log to.
	 */
	private static final Logger LOG = Logger.getLogger(WebSocketServer.class.getName());
	private static WebSocketServer instance = null;
	private WebSocket socket;

	public static WebSocketServer getInstance() {
		if (instance == null) {
			instance = new WebSocketServer(9090);
		}
		return instance;
	}

	private WebSocketServer(int port) {
		super(port);
	}

	public void broadcast(String message) {
		if (!this.wasStarted() || socket == null)
			return;
		try {
			socket.send(message);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// synchronized (socketList) {
		// for (Iterator<WebSocket> iterator = socketList.iterator();
		// iterator.hasNext();) {
		// WebSocket socket = iterator.next();
		// if (!socket.isOpen())
		// iterator.remove();
		// else
		// try {
		// socket.send(message);
		// } catch (IOException e) {
		// iterator.remove();
		// }
		// }
		// }
	}

	@Override
	protected WebSocket openWebSocket(IHTTPSession handshake) {
		socket = new DebugWebSocket(this, handshake);
		// synchronized (socketList) {
		// socketList.add(socket);
		// }
		return socket;
	}

	private static class DebugWebSocket extends WebSocket {
		private final WebSocketServer server;

		public DebugWebSocket(WebSocketServer server, IHTTPSession handshakeRequest) {
			super(handshakeRequest);
			this.server = server;
		}

		@Override
		protected void onOpen() {
		}

		@Override
		protected void onClose(CloseCode code, String reason, boolean initiatedByRemote) {
		}

		@Override
		protected void onMessage(WebSocketFrame message) {
			try {
				message.setUnmasked();
				sendFrame(message);
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}

		@Override
		protected void onPong(WebSocketFrame pong) {
		}

		@Override
		protected void onException(IOException exception) {
			// TODO Auto-generated method stub

		}
	}

}

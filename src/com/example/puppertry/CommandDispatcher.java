package com.example.puppertry;

import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

import com.example.puppertry.helpers.CommandChain;
import com.example.puppertry.helpers.Commands;

public class CommandDispatcher {

	

	private static String CommandTemplate = "{\"cmds\":%s,\"ort\":[%f,%f,%f,%f]}";

	private final WebSocketServer webSocketServer;
	private final CommandChain commandChain;
	private double alpha, beta, gamma;
	private double linearAcceleration;

	public CommandDispatcher(WebSocketServer webSocketServer) {
		this.webSocketServer = webSocketServer;
		commandChain = new CommandChain();
	}

	public void sendCommand() {

		StringBuilder commandString = new StringBuilder("[");
		Commands value = commandChain.poll();
		while (value != null) {
			commandString.append(value.getInt());
			value = commandChain.poll();
			if (value != null)
				commandString.append(",");

		}
		commandString.append("]");

		webSocketServer.broadcast(String.format(Locale.ENGLISH, CommandTemplate, commandString.toString(), alpha, beta,
				gamma, linearAcceleration));

	}

	public void setCommand(Commands command) {
		commandChain.add(command);
	}
	
	public void clearCommand(Commands command){
		commandChain.remove(command);
	}

	public void setEuler(double alpha, double beta, double gamma) {
		this.alpha = alpha;
		this.beta = beta;
		this.gamma = gamma;
	}

	public void setLinearAcceleration(double acceleration) {
		this.linearAcceleration = acceleration;
	}

}

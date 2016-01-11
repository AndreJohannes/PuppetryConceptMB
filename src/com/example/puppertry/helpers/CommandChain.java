package com.example.puppertry.helpers;

import java.util.LinkedList;
import java.util.Queue;


public class CommandChain extends LinkedList<Commands> implements Queue<Commands> {

	
	private LinkedList<Commands> repopList = new LinkedList();

	@Override
	public Commands poll() {
		Commands command = super.poll();
		if(command==null){
			super.addAll(repopList);
			repopList.clear();
			return null;
		}
		if(!command.isOneHitOnly()){
			repopList.add(command);
		}
		return command;
	}

}

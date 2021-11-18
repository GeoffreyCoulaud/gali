/**
 * A class representing an IPC message type (enum)
 */
class MessageType{
	static Generic = new MessageType("Generic");
	static RequestScan = new MessageType("RequestScan");
	static ScanHasEnded = new MessageType("ScanHasEnded");
	static RequestLibraryChunk = new MessageType("RequestLibraryChunk");
	static ResponseLibraryChunk = new MessageType("ResponseLibraryChunk");

	constructor(name){
		this.name = name;
	}
}

/**
 * A class representing an IPC message that can be sent from the main process
 * or a subprocess.
 */
class Message{

	type = MessageType.Generic;
	data = undefined;

	/**
	 * Create an IPC message
	 * @param {MessageType} type - The message type
	 * @param {*} data - The data to pass with the message
	 */
	constructor(type, data = undefined){
		this.type = type;
		this.data = data;
	}

}

module.exports = {
	Message,
	MessageType,
};
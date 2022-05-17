'use strict'
import { Request } from './Request.js'
import { Socket } from './Socket.js'

/**
 * @abstract
 * @method connect
 * @method call
 */
export class Client {
  static #socket = new Socket()
  static #requestId = 0x80000000

  /**
  * Connects to dedicated server and waits for handshake.
  * Rejects promise if connection is failed or server doesn't use "GBXRemote 2" protocol
  * @param {String} host ip of dedicated server (default localhost)
  * @param {Number} port port at which dedicated server is listening for XmlRpc (default 5000)
  * @returns {Promise<String>} handshake status
  */
  static async connect (host = 'localhost', port = 5000): Promise<string> {
    this.#socket.connect(port, host)
    this.#socket.setKeepAlive(true)
    this.#socket.setupListeners()
    return await this.#socket.awaitHandshake().catch(async err => await Promise.reject(err))
  }

  /**
  * Calls a dedicated server method. Rejects promise if server responds error.
  * On error passes object containing errorCode and errorString properties
  * @param {String} method dedicated server method name
  * @param {Object[]} params parameters, each param needs to be under key named after its type
  * @param {boolean} expectsResponse if set to false doesnt poll the response and returns null.
  * @returns {Promise<any[]>} array of server response values
  */
  static async call (method: string, params: object[] = [], expectsResponse = true): Promise<any[]> {
    this.#requestId++ // increment requestId so every request has an unique id
    const request = new Request(method, params)
    const buffer = request.getPreparedBuffer(this.#requestId)
    this.#socket.write(buffer)
    if (!expectsResponse) { return [] }
    return await this.#socket.awaitResponse(this.#requestId, method).catch(async err => await Promise.reject(err))
  }
}
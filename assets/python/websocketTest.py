import websocket
import thread
import time
import json
import numpy
import matplotlib.pylab as py

def on_message(ws, message):
    a.append(json.loads(message))
    print message

def on_error(ws, error):
    print error

def on_close(ws):
    print "### closed ###"

def on_open(ws):
    def run(*args):
        for i in range(5):
            time.sleep(1)
            #ws.send("Hello %d" % i)
        time.sleep(1)
        ws.close()  
        print "thread terminating..."
    thread.start_new_thread(run, ())

def _derivative(x,y):
    dx = numpy.diff(x).tolist();dx.append(1);
    dy = numpy.diff(y).tolist();dy.append(0);
    return [dy[i]/dx[i] for i in range(len(dx))];

def _doublederivative(x,y):
    dx = numpy.diff(x).tolist();dx.append(1);
    dy = numpy.diff(y).tolist();dy.append(0);
    return _derivative(dx,dy);

if __name__ == "__main__":
    websocket.enableTrace(True)
    a = []
    ws = websocket.WebSocketApp("ws://192.168.1.69:9090/",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()
    fig, ax = py.subplots(3,1);
    accx = [x[3] for x in a];
    accy = [x[4] for x in a];
    accz = [x[5] for x in a];
    time = [x[9] for x in a];
    ax[0].plot([x[9] for x in a],[[x[0],x[1],x[2]] for x in a]);
    ax[1].plot([x[9] for x in a],[[x[3],x[4],x[5]] for x in a]);
    ax[2].plot([x[9] for x in a],[[x[6],x[7],x[8]] for x in a]);
    py.show();
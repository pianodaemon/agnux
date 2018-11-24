#!/usr/bin/python3


from logging.handlers import TimedRotatingFileHandler
import multiprocessing
import traceback
import argparse
import logging
import sys
from bbgum.server import BbGumServer


def listener_configurer(debug):
    # if no name is specified, return a logger
    # which is the root logger of the hierarchy.
    root = logging.getLogger()

    # create console handler with a higher log level
    ch = logging.StreamHandler()
    ch.setLevel(debug)

    # create formats and add them to the handlers
    ch_formatter = logging.Formatter(
        '%(asctime)s %(processName)-10s %(name)s %(levelname)-8s %(message)s')
    ch.setFormatter(ch_formatter)

    # add the handlers to root
    root.addHandler(ch)


def listener_process(queue, configurer, debug=False):
    '''process that receives log traces from connection process'''

    configurer(debug)
    while True:
        try:
            record = queue.get()
            if record is None:  # We send this as a sentinel to tell the listener to quit.
                print('Finishing log listener')
                break
            logger = logging.getLogger(record.name)
            logger.handle(record)  # No level or filter logic applied - just do it!
        except KeyboardInterrupt:
            # SIGINT is masked in the child processes. 
            # that's why this workaround is required
            # to exit reliably
            pass
        except:
            if debug:
                print('Whoops! Problem in log listener:', file=sys.stderr)
                traceback.print_exc(file=sys.stderr)


def fetch_base_dirs():
    '''Conforms base directories for microservice'''
    d = {}

    d['RESOURCES_DIR'] = os.path.join(os.environ.get("MS_BASE_DIR"),
                                      'resources')
    if not os.path.isdir(d['RESOURCES_DIR']):
        raise Exception('We can not go ahead without a resource directory')

    d['PROFILES_DIR'] = os.path.join(d['RESOURCES_DIR'],
                                     'profiles')
    if not os.path.isdir(d['PROFILES_DIR']):
        raise Exception('We can not go ahead without a profile directory')

    return d


if __name__ == "__main__":

    debug = eval('logging.' + os.environ.get('MS_DEBUG'))
    base_dirs = fetch_base_dirs()

    profile_path = os.path.join(base_dirs['PROFILES_DIR'],
                                os.environ.get('MS_PROFILE'))
    if not os.path.exists(profile_path):
        raise Exception('We can not go ahead without a profile')

    port = int(os.environ.get('MS_PORT'))

    queue = multiprocessing.Queue(-1)
    listener = multiprocessing.Process(target=listener_process,
                                       args=(queue, listener_configurer, debug))
    listener.start()

    try:
        server = BbGumServer(queue, profile_path, port)
        server.start(debug)
    except KeyboardInterrupt:
        print('Exiting')
    except:
        if debug == logging.DEBUG:
            print('Whoops! Problem in server:', file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
        sys.exit(1)

    # it'll break eternal loop inside listener process
    queue.put_nowait(None)
    listener.join()

    # assuming everything went right, exit gracefully
    sys.exit(0)

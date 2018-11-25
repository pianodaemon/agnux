#!/usr/bin/python3


import os
import multiprocessing
import traceback
import argparse
import logging
import sys
from bbgum.server import BbGumServer
from custom.profile import env_property


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


if __name__ == "__main__":

    debug = eval('logging.' + env_property('MS_DEBUG'))

    queue = multiprocessing.Queue(-1)
    listener = multiprocessing.Process(target=listener_process,
                                       args=(queue, listener_configurer, debug))
    listener.start()

    try:
        resources_dir = os.path.join(env_property("MS_BASE_DIR"), 'resources')

        if not os.path.isdir(resources_dir):
            raise Exception('We can not go ahead without a resource directory')

        profiles_dir = os.path.join(resources_dir, 'profiles')
        if not os.path.isdir(profiles_dir):
            raise Exception('We can not go ahead without a profile directory')

        profile_path = os.path.join(profiles_dir, env_property('MS_PROFILE'))
        if not os.path.exists(profile_path):
            raise Exception('We can not go ahead without a profile')

        port = env_property('MS_PORT', int)

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

#!/usr/bin/python3


import sys
import os
import multiprocessing
import traceback
import logging
from os.path import expanduser


if __name__ == "__main__":

    RESOURCES_DIR = os.path.join(expanduser("~"), 'resources')
    PROFILES_DIR = os.path.join(RESOURCES_DIR, 'profiles')
    LOGS_DIR = os.path.join(RESOURCES_DIR, 'logs')
    DEFAULT_PORT = 10080
    DEFAULT_PROFILE = 'default.json'

    profile_path = os.path.join(
        PROFILES_DIR,
        os.environ.get('MS_PROFILE') if os.environ.get('MS_PROFILE') else DEFAULT_PROFILE)

    port = int(os.environ.get('MS_PORT')) if os.environ.get('MS_PORT') else DEFAULT_PORT

    debuglev = logging.DEBUG if os.environ.get('MS_DEBUG') else logging.INFO

    print("Test on Container")
    while True:
        pass

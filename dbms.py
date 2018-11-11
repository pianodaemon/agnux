#!/usr/bin/python3


import argparse
import sys
import tools

CONTAINER = '/dbms'

def __set_cmdargs_up():
    """parses the command line arguments at the call."""

    psr_desc = "dbms containerized for this farm"
    psr_epi = "execute control actions upon dbms containerized"

    psr = argparse.ArgumentParser(description=psr_desc, epilog=psr_epi)

    psr.add_argument('-a', '--action', action='store',
                     dest='action', help='execute action upon dbms')

    return psr.parse_args()


if __name__ == "__main__":

    args = __set_cmdargs_up()

    try:
        psrc = tools.PseudoRc()
        rv = psrc(CONTAINER, args.action)
        if rv is None:
            print('Done')
        else:
            print(rv)
    except Exception as error:
        print(error)
        sys.exit(1)

    sys.exit(0)

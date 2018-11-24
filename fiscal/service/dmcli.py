#!/usr/bin/python3

import os
import sys
import traceback
import argparse
import logging
from os.path import expanduser
from docmaker.pipeline import DocPipeLine
from custom.profile import ProfileReader


def _set_cmdargs_up():
    """parses the cmd line arguments at the call"""

    psr_desc='Document maker command line control interface'
    psr_epi='The config profile is used to specify defaults'

    psr = argparse.ArgumentParser(description=psr_desc, epilog=psr_epi)

    psr.add_argument(
        '-b', '--builder',
        dest='dm_builder', help='specify the builder to use'
    )
    psr.add_argument(
        '-i', '--input',
        dest='dm_input', help='specify the input variables with \'var=val;var2=val2;var2=valN\'..'
    )
    psr.add_argument(
        '-o', '--output',
        dest='dm_output', help='specify the output file'
    )

    return psr.parse_args()


def dmcli(args, logger):

    RESOURCES_DIR = os.path.join(os.environ.get("MS_BASE_DIR"),
                                 'resources')
    if not os.path.isdir(RESOURCES_DIR):
        raise Exception('We can not go ahead without a resource directory')

    PROFILES_DIR = os.path.join(RESOURCES_DIR, 'profiles')

    if not os.path.isdir(PROFILES_DIR):
        raise Exception('We can not go ahead without a profile directory')

    def read_settings(s_file):
        logger.debug("looking for config profile file in:\n{0}".format(
            os.path.abspath(s_file)))
        if os.path.isfile(s_file):
            reader = ProfileReader(logger)
            return reader(s_file)
        raise Exception("unable to locate the config profile file")

    profile_path = os.path.join(PROFILES_DIR, os.environ.get('MS_PROFILE'))

    if not os.path.exists(profile_path):
        raise Exception('We can not go ahead without a profile')

    pt = read_settings(profile_path)

    if not args.dm_output:
        raise Exception("not defined output file")

    if args.dm_builder:
        if not args.dm_input:
            raise Exception("not defined input variables")

        kwargs = {}
        try:
            if args.dm_input.find(';') == -1:
                raise Exception("input variables bad conformed")
            else:
                for opt in args.dm_input.split(';'):
                    if opt.find('=') == -1:
                        continue
                    (k , v) = opt.split('=')
                    kwargs[k] = v
        except ValueError:
            raise Exception("input variables bad conformed")

        try:
            dpl = DocPipeLine(logger, RESOURCES_DIR, rdirs_conf = pt.res.dirs)
            dpl.run(args.dm_builder, args.dm_output, **kwargs)
        except:
            raise Exception("problems in document pipeline")
    else:
        raise Exception("builder module not define")


if __name__ == "__main__":

    logger = logging.getLogger(__name__)
    debug = eval('logging.' + os.environ.get('MS_DEBUG'))
    logging.basicConfig(debug)

    try:
        dmcli(_set_cmdargs_up(), logger)
        logger.info('successful builder execution')
    except:
        if debug == logging.DEBUG:
            traceback.print_exc()
        sys.exit(1)

    sys.exit(0)

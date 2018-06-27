import sys
import argparse
import pkg_resources

from sawtooth_sdk.processor.core import TransactionProcessor
from sawtooth_sdk.processor.log import init_console_logging
from sawtooth_sdk.processor.log import log_configuration
from sawtooth_sdk.processor.config import get_log_config
from sawtooth_sdk.processor.config import get_log_dir
from handler.handler import ExampleTXHandler


DISTRIBUTION_NAME = 'sawtooth-CUSTOM-TP'
tp_config_name='example_tp'


def parse_args(args):

    print(args)
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawTextHelpFormatter)

    parser.add_argument(
        '-C', '--connect',
        default='tcp://validator:4004',
        help='Endpoint for the validator connection')

    parser.add_argument('-v', '--verbose',
                        action='count',
                        default=2,
                        help='Increase output sent to stderr')

    try:
        version = pkg_resources.get_distribution(DISTRIBUTION_NAME).version
    except pkg_resources.DistributionNotFound:
        version = 'UNKNOWN'

    parser.add_argument(
        '-V', '--version',
        action='version',
        version=(DISTRIBUTION_NAME + ' (Hyperledger Sawtooth) version {}')
        .format(version),
        help='print version information')
    return parser.parse_args(args)


def main(args=None):
    if args is None:
        args = sys.argv[3:]  # considering the starting command is `python3 main.py` and then additional arguments
    
    opts = parse_args(args)
    processor = None
    
    try:
        processor = TransactionProcessor(url=opts.connect)
        log_config = get_log_config(filename=tp_config_name+"_log_config.toml")
        # If no toml, try loading yaml
        if log_config is None:
            log_config = get_log_config(filename=tp_config_name+"_log_config.yaml")
        if log_config is not None:
            log_configuration(log_config=log_config)
        else:
            log_dir = get_log_dir()
            # use the transaction processor zmq identity for filename
            log_configuration(
                log_dir=log_dir,
                name=tp_config_name+"-" + str(processor.zmq_id)[2:-1])
        init_console_logging(verbose_level=opts.verbose)
        # The prefix should eventually be looked up from the
        # validator's namespace registry.
        handler = ExampleTXHandler()
        processor.add_handler(handler)
        processor.start()

    except KeyboardInterrupt:
        pass
    except Exception as e:  # pylint: disable=broad-except
        print("Error: {}".format(e), file=sys.stderr)
    finally:
        if processor is not None:
            processor.stop()

main()

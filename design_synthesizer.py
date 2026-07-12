import sys
import argparse
from src.synthesizer import Synthesizer
import src.synthesizer as synthesizer

def main(argv):

    args_parser = argparse.ArgumentParser(
        description="Synthesizes a python program given the package with the metadata"
    )

    args_parser.add_argument(
        "--package",
        required=False,
        help="Path to synth package json file"
    )
    
    parsed_args = args_parser.parse_args(argv[1:])

    print(parsed_args)

    if ("package" in parsed_args and parsed_args.package):
        package = parsed_args.package

        try:
            open(package)
        except Exception as e:
            print(f"Invalid arguments: {str(e)}", file=sys.stderr)
            return -1

        synth = Synthesizer(package)
    else:
        synth = Synthesizer(None)

    synth.run()


if "__main__" == __name__:
    sys.exit(main(sys.argv))
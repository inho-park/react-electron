import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')


def convert_webm_mp4_subprocess(input_file, output_file):
    command_path = 'set path=%path%;' + os.getcwd() + r'\ffmpeg\bin; &'
    command_ffm = 'ffmpeg -i ' + input_file + ' ' + output_file
    print(command_path + command_ffm)
    os.system(command_path + command_ffm)


# convert_webm_mp4_subprocess('../video/test.webm', '../video/test.mp4')
def main(argv):
    convert_webm_mp4_subprocess(argv[1], argv[2])


if __name__ == "__main__":
    main(sys.argv)

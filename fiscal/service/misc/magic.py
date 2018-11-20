import enum


class UMT(enum.Enum):
    """
    Unix terminal format codes
    """
    NORMAL        = '\033[0m'
    BOLD          = '\033[1m'
    DIM           = '\033[2m'
    UNDERLINE     = '\033[4m'
    REVERSE       = '\033[7m'
    STRIKETHROUGH = '\033[9m'
    RED           = '\033[31m'
    YELLOW        = '\033[33m'


def attached_var(name, value):
    """
    Decorator to mimic static variables
    """
    def decorate(func):
        setattr(func, name, value)
        return func

    return decorate

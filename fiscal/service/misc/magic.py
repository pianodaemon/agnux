

def attached_var(name, value):
    """Decorator to mimic static variables"""
    def decorate(func):
        setattr(func, name, value)
        return func
    return decorat

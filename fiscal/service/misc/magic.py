

def static_var(vname, vval):
    """Decorator to mimic static variables"""
    def decorate(func):
        setattr(func, vname, vval)
        return func
    return decorat

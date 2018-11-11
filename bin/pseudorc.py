import docker


class PseudoRc(object):
    '''
    Performs as an old fashion slackware rc.whatever scripts
    '''

    def __init__(self, conn):
        self._conn = conn

    def __call__(self, name, action, before=None, after=None):
        '''Stops, starts and restarts a container as per name'''

        def status():
            lcandidates = self._conn.containers.list(all=True, filters = {'name':name})
            if not lcandidates:
                raise Exception('There are no containers')
            for i in lcandidates:
                if i.attrs['Name'] == name:
                    return(i.status)
            raise Exception('There is not a container with such name')

        def ssr(s):
            lcandidates = self._conn.containers.list(all=True, filters = {'status':s})
            if not lcandidates:
                raise Exception('There are not containers {}'.format(s))
            for i in lcandidates:
                if i.attrs['Name'] == name:
                    if before is not None:
                        before(i)
                    eval('i.' + action + '()')
                    if after is not None:
                        after(i)
                    return None
            raise Exception('There is not a container with such name')

        try:
            return {
                'start': lambda: ssr('exited'),
                'stop': lambda: ssr('running'),
                'restart': lambda: ssr('running'),
                'status': lambda: status(),
            }[action]()
        except KeyError:
            raise Exception("invalid action")

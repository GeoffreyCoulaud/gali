pkgdatadir = join_paths(get_option('prefix'), get_option('datadir'), meson.project_name())
moduledir = join_paths(pkgdatadir, 'gali')
gnome = import('gnome')

python = import('python')

conf = configuration_data()
conf.set('PYTHON', python.find_installation('python3').path())
conf.set('VERSION', meson.project_version())
conf.set('localedir', join_paths(get_option('prefix'), get_option('localedir')))
conf.set('pkgdatadir', pkgdatadir)

configure_file(
    input: 'gali.in',
    output: 'gali',
    configuration: conf,
    install: true,
    install_dir: get_option('bindir')
)

install_subdir('games', install_dir: moduledir)
install_subdir('sources', install_dir: moduledir)
install_subdir('ui', install_dir: moduledir)
install_subdir('utils', install_dir: moduledir)
install_data(
    [
        '__init__.py',
        'main.py',
        'library.py',
    ], 
    install_dir: moduledir
)
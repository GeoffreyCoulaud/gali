gnome = import('gnome')

gnome.compile_resources('gali',
    'gali.gresource.xml',
    gresource_bundle: true,
    install: true,
    install_dir: pkgdatadir,
)

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

install_subdir('sources', install_dir: moduledir)
install_subdir('ui', install_dir: moduledir)
install_subdir('utils', install_dir: moduledir)
install_data(
    [
        '__init__.py',
        'main.py',
        'library.py',
        'launcher.py',
        'singletons.py',
        'game_wrapper_process.py'
    ], 
    install_dir: moduledir
)
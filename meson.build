project(
	'gali',
	version: '0.1.0',
	meson_version: '>= 0.59.0',
	default_options: [ 
		'warning_level=2',
		'werror=false',
	],
)

datadir = join_paths(get_option('prefix'), get_option('datadir'))
pkgdatadir = join_paths(datadir, meson.project_name())
moduledir = join_paths(pkgdatadir, 'gali')

subdir('data')
subdir('src')
subdir('po')

gnome = import('gnome')
gnome.post_install(
	glib_compile_schemas: true,
	gtk_update_icon_cache: true,
	update_desktop_database: true,
)

var gulp 			= require('gulp'), // Подключаем Gulp
    sass 			= require('gulp-sass'), //Подключаем Sass пакет
    browserSync 	= require('browser-sync'), // Подключаем Browser Sync
    jade 			= require('gulp-jade'), // Подключаем Jade
    concat      	= require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify      	= require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     	= require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      	= require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del         	= require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin    	= require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant    	= require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache      		= require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer 	= require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
    plumber         = require('gulp-plumber'); // ловим ошибки

gulp.task('sass', function() { // Создаем таск "sass"
    return gulp.src('app/sass/**/*.sass') // Берем источник из папки sass и дочерних, если такие будут
    .pipe(plumber())
    .pipe(sass({ // Преобразуем Sass в CSS посредством gulp-sass
        indentType: 'tab', // последние 4 строчки для удобочитаемости css
        indentWidth: 1, // заодно это позволяет разбивать на множество партиалов
        outputStyle: 'expanded', // и галп не вылетает
    })).on('error', sass.logError) 
    .pipe(gulp.dest('app/css')) // Выгружаем результат в папку app/css
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
    
    .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении   
});

gulp.task('jade', function(){
	return gulp.src([
        'app/jade/main-page/index.jade',
        'app/jade/news-page/news-page.jade',
        'app/jade/products-page/products-page.jade',
        'app/jade/company-page/company-page.jade',
        'app/jade/free-page/free-page.jade',
        'app/jade/service-page/service-page.jade'
        ])

	.pipe(plumber())
	.pipe(jade({
		pretty: true
	}))
	.pipe(gulp.dest('app'))
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },

        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
        ])
    .pipe(plumber())
    .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
    .pipe(uglify()) // Сжимаем JS файл
    .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['sass'], function() {   // в скобках прямоугольных пишем то, что должно выполнится сначала или ДО того как выполнится сам таск
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации 
   
    .pipe(cssnano()) // Сжимаем
    .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
    .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('clean', function(){
	return del.sync('dist'); // удаляем папку dist перед сборкой
});

gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('watch', ['browser-sync', /*'css-libs',*/ 'sass', 'jade', 'scripts'], function() { // убираем sass, т.к. он теперь выполняется в css-libs
	gulp.watch('app/sass/**/*.sass', ['sass']);			//отслеживаем изменения и автоматически преобразуем в css
	gulp.watch('app/jade/**/*.jade',['jade'],); 		// отслеживаем изменения и автоматически преобразуем в html
	gulp.watch('app/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
    
    .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts', 'jade'], function(){
	var buildCss = gulp.src([ // переносим CSS стили в продакшн
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // переносим шрифты в продакшн
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html')  // Переносим HTML в продакшн
	.pipe(gulp.dest('dist'))

	// var biuldJade = gulp.src('app/*.jade') // Переносим Jade в продакшн
	// .pipe(gulp.dest('dist'));
});


// когда обрабатываем 1 src, то пишем 
// return
// 	.pipe
// 	.pipe
// 	.pipe
/*а когда несколько src ставим квадратные скобки: 
var buildCss = gulp.src([ 
	'app/css/main.css',
	'app/css/libs.min.css',
	])
.pipe(gulp.dest('dist/css'))

можно как больше нравится*/

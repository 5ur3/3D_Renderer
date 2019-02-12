# Простой 3д рендерер.
## Просмотреть можно тут: https://5ur3.github.io/3D_Renderer/
## Чтобы запустить локально, необходим вебсервер
## Наибольшую производительность показывает в google chrome и oper

# Документация:

'''
Объекты {
	Vector {
		Атрибуты объекта {
			x: Number (0)
			y: Number (0)
			z: Number (0)
			[get] length: Number // Содержит длину вектора
			[get] normalized: Vector // Содержит вектор, направление которого совпадает с вектором объекта, а длина равна 1
			[get] copy: Vector // Возвращает копию вектора объекта
		}
		Функции объекта {
			add(: Vector) : Vector // Добавляет к вектору объекта вектор и возвращает полученный вектор
			substract(: Vector) : Vector // Вычитает от вектора объекта вектор и возвращает полученный вектор
			multiply(factor: Number) : Vector // Умножает каждый компонент вектора на число и возвращает полученный вектор
			divide(factor: Number) : Vector // Делит каждый компонент вектора на число и возвращает полученный вектор
			distance(: Vector) : Number // Возвращает расстояние между вектором объекта и аргументом
			angle(: Vector) : Number [0; +Math.PI] // Возвращает угол между вектором объекта и аргументом
			dot(: Vector) : Number // Возвращает скалярное произведение вектора объекта и аргумента
			cross(: Vector) : Vector // Возвращает вектор, перпендикулярный к вектору объекта и аргументу
			equal(: Vector) : Boolean // Возвращает true если вектор объекта равен вектору аргумента. Иначе возвращает false
		}
		Статичные функции {
			Vector.distance_squared(vector1: Vector, vector2: Vector) : Number // Возвращает квадрат расстояния между точками
			Vector.distance(vector1: Vector, vector2: Vector) : Number // Возвращает расстояние между точками
			Vector.length(vector: Vector) : Number // Возвращает длину вектора
			Vector.angle(vector1: Vector, vector2: Vector) : Number [-Math.PI; +Math.PI] // Возвращает угол между векторами
			Vector.normalize(vector: Vector) : Vector // Возвращает вектор, направление которого совпадает с вектором аргумента, а длина равна 1
			Vector.add(vector1: Vector, vector2: Vector) : Vector // Возвращает vector1 + vector2
			Vector.substract(vector1: Vector, vector2: Vector) : Vector // Возвращает vector1 - vector2
			Vector.multiply(vector: Vector, factor: Number) : Vector // Возвращает вектор, полученный в результате перемножения каждого компонента вектора на число
			Vector.divide(vector: Vector, factor: Number) : Vector // Возвращает вектор, полученный в результате деления каждого компонента вектора на число
			Vector.dot(vector1: Vector, vector2: Vector) : Number // Возвращает скалярное произведение векторов
			Vector.cross(vector1: Vector, vector2: Vector) : Vector // Возвращает вектор, перпендикулярный сразу к двум векторам
			Vector.equal(vector1: Vector, vector2: Vector) : Boolean // Возвращает true если вектора равны. Иначе возвращает false
		}
	}
	Mesh {
		Атрибуты объекта {
			polygons: Array // массив полигонов. Каждый полигон является массивом векторов длиной 3
			normals: Array // нормали для каждого полигона
		}
		Статичные поля {
			Mesh.empty: Mesh // Пустой mesh
			Mesh.cube: Mesh // Куб
			Mesh.sphere: Mesh // Сфера
			Mesh.cylinder: Mesh // Цилиндр
			Mesh.pyramid: Mesh // Пирамида
			Mesh.cat: Mesh // Модель кота
			Mesh.cat_lpoly: Mesh // Низкополигональная модель кота
			Mesh.deer: Mesh // Олень
		}
		Статичные функции {
			Mesh.load_object(path: Str) : Mesh // Возвращает модель, взятую из файла .obj
		}
	}
	Object3D {
		Атрибуты объекта {
			position: Vector (0, 0, 0)
			rotation: Vector (0, 0, 0)
			scale: Vector (1, 1, 1) // Множитель размера
			mesh: Array (Mesh.cube) // Полигональная фигура
			center: Vector (0, 0, 0) // Точка опоры объекта
			enabled: Boolean (true)
			color: Vector (1, 1, 1) [0; 1] // Множители каналов цвета R G и B на отрисовке
		}
	}
	Camera {
		Атрибуты объекта {
			position: Vector (0, 0, -10)
			rotation: Vector (0, 0, 0)
			field_of_view: Number (90) // Угол обзора камеры
		}
		Функции объекта {
			look(direction: Vector) : void // Поворачивает камеру по вектору
		}
	}
}

Глобальные объекты {
	properties {
		Атрибуты объекта {
			framerate: Number (60) // Частота вызова функции update
			quality: Number (1) [1, 2, 3, 4] // Количество пикселей просчитываемых одновременно (1 - 100%; 4 - 25%);
			quality_auto: Boolean (1) // Автоматический контроль качества
			wireframe: Boolean (0) // Показывать только сетку mesh
		}
	}
}

Глобальные функции {
	lerp(val1: Number, val2: Number, val) : Number // Возвращает посчитанное по следующей формуле число: val1 + (val2 - val1) * val;
	render(camera: Camera) : void // Выводит изображение с камеры на экран
	load_file(path: Str) : Str // Возвращает содержание текстового файла
}

Пользовательские функции (Должны быть объявлены в main.js) {
	function update() {//...} // Вызывается properties.framerate раз в секунду
	function onMouseDown(mouse: Vector) // Вызывается при нажатии на левую кнопку мыши и передает вектор, содержащий позицию мыши в координатах canvas
	function onMouseMove(mouse: Vector) // Вызывается при движении мыши и передает вектор, содержащий позицию мыши в координатах canvas
	function onMouseUp(mouse: Vector) // Вызывается при отжатии левой кнопки мыши и передает вектор, содержащий позицию мыши в координатах canvas
	function onMouseWheel(wheel: Vector) // Вызывается при движении колесиком мыши и передает вектор, содержащий передвижение колесика
}
'''

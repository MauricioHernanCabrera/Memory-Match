'use strict';

function medirTiempo() {
	if (parseInt($minuto.textContent) == 0 && parseInt($segundo.textContent) == 0) {
		clearInterval(medidorDelTiempo);
		partida.termino_la_animacion = false;

		for (var i = 0; i < longitud; i++) {
			tarjetas[i].children[0].className = 'icon';
			tarjetas[i].dataset.key = 0;
		}

		swal({
			title: 'Perdiste!',
			text: '¿Quieres jugar de nuevo?',
			buttons: ["No", "Si"]
		}).then(function (ok) {
			if (ok) {

				generarTarjetasAleatorias();
				setTimeout(function () {
					activar_desactivarTarjetas();
					setTimeout(function () {
						activar_desactivarTarjetas();
						medidorDelTiempo = setInterval(medirTiempo, 1000);
					}, 5000);
				}, 100);
				partida.llave = 0;
				partida.llave2 = 0;
				partida.cont_tocado_par = 0;
				partida.tarjeta = 0;
				partida.tarjeta2 = 0;
				partida.termino_la_animacion = true;
				partida.cont_jugadas = 0;
				$minuto.textContent = '02';
				$segundo.textContent = '00';
			}
		});
	} else {
		tiempo.minuto = parseInt($minuto.textContent);
		tiempo.segundo = parseInt($segundo.textContent);

		if (tiempo.segundo == 0 && tiempo.minuto > 0) {
			tiempo.minuto--;
			tiempo.segundo = 60;
		}

		tiempo.segundo--;

		$minuto.textContent = tiempo.minuto <= 9 ? '0' + tiempo.minuto : tiempo.minuto;
		$segundo.textContent = tiempo.segundo <= 9 ? '0' + tiempo.segundo : tiempo.segundo;
	}
}

function generarTarjetasAleatorias() {
	for (var i = 0; i < parseInt(longitud / 2); i++) {
		var eliminado = iconos[i];

		var llave = llaveAleatoria();
		var llave2 = llaveAleatoria();

		if (tarjetas[llave].dataset.key == 0) {
			tarjetas[llave].dataset.key = eliminado.numero;
		} else {
			while (tarjetas[llave].dataset.key != 0) {
				llave = llaveAleatoria();
			}
			tarjetas[llave].dataset.key = eliminado.numero;
		}

		if (tarjetas[llave2].dataset.key == 0) {
			tarjetas[llave2].dataset.key = eliminado.numero;
		} else {
			while (tarjetas[llave2].dataset.key != 0) {
				llave2 = llaveAleatoria();
			}
			tarjetas[llave2].dataset.key = eliminado.numero;
		}

		tarjetas[llave].children[0].classList.add(eliminado.nombre);
		tarjetas[llave2].children[0].classList.add(eliminado.nombre);
	}
}
function activar_desactivarTarjetas() {
	for (var i = 0; i < longitud; i++) {
		tarjetas[i].classList.toggle('activo');
		tarjetas[i].children[0].classList.toggle('activo');
	}
}
function llaveAleatoria() {
	var min = 0;
	var max = longitud - 1;
	return Math.round(Math.random() * (max - min) + min);
}

function esLlaveValida(ev) {
	if (ev.path[0].dataset.key >= 1 && ev.path[0].dataset.key <= parseInt(longitud / 2)) {
		return true;
	} else {
		return false;
	}
}

function sonLaMismaLlave() {
	if (partida.llave2 == partida.llave) {
		return true;
	} else {
		return false;
	}
}
function cambiarIconoDelMenu() {
	$boton_menu.classList.toggle('icon-close');
}
function desplegarMenuDeOpciones() {
	$menu.classList.toggle('active');
}

var partida = {
	llave: 0,
	llave2: 0,
	cont_tocado_par: 0,
	tarjeta: 0,
	tarjeta2: 0,
	termino_la_animacion: true,
	cont_jugadas: 0
};

var tarjetas = document.getElementsByClassName('tarjeta');
var longitud = tarjetas.length;

var $minuto = document.getElementById('minuto');
var $segundo = document.getElementById('segundo');

var $boton_menu = document.getElementById('boton-menu');
var $menu = document.getElementById('menu');

var medidorDelTiempo = void 0;

var tiempo = {
	minuto: 0,
	segundo: 0
};

var iconos = [{ nombre: 'icon-html-five', numero: 1 }, { nombre: 'icon-google', numero: 2 }, { nombre: 'icon-twitter', numero: 3 }, { nombre: 'icon-youtube', numero: 4 }, { nombre: 'icon-tux', numero: 5 }, { nombre: 'icon-facebook', numero: 6 }, { nombre: 'icon-appleinc', numero: 7 }, { nombre: 'icon-android', numero: 8 }, { nombre: 'icon-windows', numero: 9 }, { nombre: 'icon-chrome', numero: 10 }, { nombre: 'icon-firefox', numero: 11 }, { nombre: 'icon-IE', numero: 12 }];

$boton_menu.addEventListener('click', function () {
	cambiarIconoDelMenu();
	desplegarMenuDeOpciones();
});

window.addEventListener('load', function () {
	generarTarjetasAleatorias();
	activar_desactivarTarjetas();
});

setTimeout(function () {

	activar_desactivarTarjetas();

	window.addEventListener('click', function (ev) {
		if (partida.termino_la_animacion) {

			/*Si se encuentra dentro de los parametros de las llaves lo toma como valido*/
			if (esLlaveValida(ev)) {
				/*Cargar dos jugadas en los proximos dos click consecutivos*/
				if (partida.llave == 0) {

					partida.tarjeta = ev.path[0];

					partida.llave = partida.tarjeta.dataset.key;

					partida.tarjeta.dataset.key = 0;
					partida.tarjeta.classList.toggle('activo');
					partida.tarjeta.children[0].classList.toggle('activo');
					partida.cont_tocado_par++;
				} else if (partida.llave2 == 0) {
					partida.tarjeta2 = ev.path[0];
					partida.llave2 = partida.tarjeta2.dataset.key;
					partida.tarjeta2.dataset.key = 0;
					partida.tarjeta2.classList.toggle('activo');
					partida.tarjeta2.children[0].classList.toggle('activo');
					partida.cont_tocado_par++;
				}

				/*Si las dos llaves*/
				if (partida.cont_tocado_par == 2) {
					if (sonLaMismaLlave()) {
						partida.cont_tocado_par = 0;
						partida.llave2 = 0;
						partida.llave = 0;
						partida.cont_jugadas++;
					} else {
						setTimeout(function () {
							partida.tarjeta2.dataset.key = partida.llave2;
							partida.tarjeta.dataset.key = partida.llave;
							partida.tarjeta2.classList.toggle('activo');
							partida.tarjeta.classList.toggle('activo');
							partida.tarjeta2.children[0].classList.toggle('activo');
							partida.tarjeta.children[0].classList.toggle('activo');

							partida.cont_tocado_par = 0;
							partida.llave2 = 0;
							partida.llave = 0;
							partida.termino_la_animacion = true;
						}, 500);

						partida.termino_la_animacion = false;
					}
				}

				if (partida.cont_jugadas == parseInt(longitud / 2)) {
					clearInterval(medidorDelTiempo);
					partida.termino_la_animacion = false;

					for (var i = 0; i < longitud; i++) {
						tarjetas[i].children[0].className = 'icon';
					}
					$minuto.textContent = '02';
					$segundo.textContent = '00';
					swal({
						title: 'Ganaste!',
						text: '¿Quieres jugar de nuevo?',
						buttons: ["No", "Si"]
					}).then(function (ok) {
						if (ok) {
							generarTarjetasAleatorias();
							setTimeout(function () {
								activar_desactivarTarjetas();
								setTimeout(function () {
									activar_desactivarTarjetas();
									medidorDelTiempo = setInterval(medirTiempo, 1000);
								}, 5000);
							}, 100);
							partida.llave = 0;
							partida.llave2 = 0;
							partida.cont_tocado_par = 0;
							partida.tarjeta = 0;
							partida.tarjeta2 = 0;
							partida.termino_la_animacion = true;
							partida.cont_jugadas = 0;
						}
					});
				}
			}
		}
	});

	medidorDelTiempo = setInterval(medirTiempo, 1000);
}, 5000);
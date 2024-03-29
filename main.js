const getElement = (id) => {
	return document.getElementById(id) ?? undefined
}
let resizeTimeout;

const config = {
	codeArea: getElement('codeArea'),
	codeFlex: getElement('codeFlex'),
	codeLines: getElement('codeLines'),

	blur: getElement('blur'),
	menu: getElement('menu')
}

function debounce(func, delay) {
    return function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(func, delay);
    }
}

function updateCodeSize() {
	const prevScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	config.codeArea.style.height = "auto"
	const height = config.codeArea.scrollHeight

	const updateSizes = (size) => {
		document.body.style.height = size
		config.codeArea.style.height = size
		config.codeFlex.style.height = size

		window.scrollTo(0, prevScrollTop);
	}

	if (height < window.innerHeight) updateSizes("100%")
	else updateSizes(height + 'px')
	
}

function updateLineNumbers() {
	const lines = config.codeArea.value.split('\n')
	let text = ''

	for (var x = 0; x < lines.length; x++) {
		text += `${parseInt(x) == 0 ? '' : '\n'}${parseInt(x) + 1}`
	}
	config.codeLines.innerHTML = text
}

function handleCodeChanges() {
	updateCodeSize();
	updateLineNumbers();
}

function blur() {
	if (config.blur.style.opacity == "1") {
		config.blur.style.opacity = "0"
		config.blur.style.zIndex = "-1"
	} else {
		config.blur.style.opacity = "1"
		config.blur.style.zIndex = "1"
	}

	console.log(config.blur.style.opacity)
	
}

function openMenu() {
	blur()

	if (config.menu.style.opacity == "1") {
		config.menu.style.opacity = "0"
		config.menu.style.zIndex = "-1"
		config.menu.style.scale = "1.5"
	} else {
		config.menu.style.opacity = "1"
		config.menu.style.zIndex = "2"
		config.menu.style.scale = "1"
	}

}

config.codeArea.addEventListener('input', debounce(handleCodeChanges, 10))
config.codeArea.addEventListener('keydown', function(event) {
	if (event.key == "Tab") {
		event.preventDefault()
		const cursorPos = config.codeArea.selectionStart;
    	const lines = config.codeArea.value.split('\n');

    	const currentLineNumber = lines.slice(0, cursorPos).length > 0 ? lines.slice(0, cursorPos).length : 1;
    	const currentLineText = lines[currentLineNumber - 1] || '';
    	lines[currentLineNumber - 1] = currentLineText + "  ";

    	config.codeArea.value = lines.join('\n');
	}
})

config.codeLines.addEventListener('keydown', function(event) {
	if (event.key == "Backspace" || event.key == "Delete") {
		event.preventDefault()
	}
})
config.codeLines.addEventListener('mousedown', function(event) {
	event.preventDefault()
})

document.addEventListener('keypress', function(event) {
	console.log(event)
	if (event.ctrlKey) {
		switch (event.code) {
			case "KeyI":
				event.preventDefault()

				openMenu()
			return;
		}
	}
})

handleCodeChanges()

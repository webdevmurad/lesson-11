window.addEventListener('DOMContentLoaded', function() {
'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');
    
    const hideTabContent = (a) => {
        tabContent.forEach((item, key) => {
            if (key !== a) {
                item.classList.remove('show');
                item.classList.add('hide');
            }
        });
    }
    hideTabContent(0);

    const showTabContent = (b) => {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', () => {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for(let i=0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(i);
                    showTabContent(i);
                    break;
                }
            }
        }
    });
    
    // Тут таймер
    let deadline = '2019-03-16';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
        seconds = Math.floor((t / 1000) % 60),
        minutes = Math.floor((t / 1000 / 60) % 60),
        hours = Math.floor((t / (1000 * 60 * 60)));

        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock () {
            let t = getTimeRemaining(endtime);
            hours.textContent = Clock(t.hours);
            minutes.textContent = Clock(t.minutes);
            seconds.textContent = Clock(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                // Когда закончится таймер он не пойдет в минус
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }
    
    // Добавляю ноль
    function Clock(n) {
        if (n < 10) {
            return `${0}` + n;
        } else {
            return n;
        }
    }

    setClock('timer', deadline);

    // Модальное окно
    const more = document.querySelectorAll('.more, .description-btn'),
          overlay = document.querySelector('.overlay'),
          close = document.querySelector('.popup-close');

    // more.addEventListener('click', function(){
    //     overlay.style.display = 'block';
    //     this.classList.add('more-splash');
    //     console.log(more);
    //     document.body.style.overflow = 'hidden';
    // });

    function modalWindow(button) {
        if (overlay.style.display === 'none') {
            overlay.style.display = 'block';
            button.classList.add('more-splash');
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.display = 'none';
            button.classList.remove('more-splash');
            document.body.style.overflow = '';
        }
    }

    more.forEach(item => {
        item.addEventListener('click', function (event) {
            modalWindow(this);
        });
    });
    close.addEventListener('click', function() {
        modalWindow(this);
    });

    // Форма

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('form.main-form'),
        tel = document.querySelectorAll('[type=tel]'),
        formContact = document.querySelector('form#form'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');
    
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            formSubmis(event);
        });

        formContact.addEventListener('submit', (event) => {
            event.preventDefault();
            formSubmis(event);
        });

        // В инпут нельзя ввести буквы, только цифры и знак +
        tel.forEach((item) => {
            item.addEventListener('input', (event) => {
                if (!event.target.value.match("^[ 0-9\+]+$")) {
                    event.target.value = event.target.value.slice(0, -1);
                }
            });
        });

    function formSubmis(event) {
        let form = event.target,
            input = form.getElementsByTagName('input');

        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');


        let formData = new FormData(form);

        for (let i = 0; i < input.length; i++) {
            formData.delete(input[i].name);
            formData.append(input[i].type, input[i].value);
            input[i].value = '';
        }

        let obj = {};
        formData.forEach(function (value, key) {
            obj[key] = value;
        });

        let json = JSON.stringify(obj);

        request.send(json);

        request.addEventListener('readystatechange', function () {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

    } 

});


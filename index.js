document.addEventListener('DOMContentLoaded', async () => {
    const main = document.querySelector('.main');
    main.style.opacity = 1;
    main.style.transform = 'translateY(0%) translateX(-50%)';

    //arrow spin thing

    //so like, I want to get the arrow to spin right
    //it starts at 0 degrees, meaning no rotation
    //if I hover over it (the first time), it rotates 180
    //if I hover out of it, it adds 180 to the current angle (becomes 360), so it looks like a clockwise rotation
    //but if I hover over the dropdown menu, I don't want it to rotate another 180 degrees
    //so my approach is to divide the current angle by 180, then check if it's an odd or even number
    //because if it's even, that means it's gone back to neutral (facing down), which in this case I don't want
    //so I subtract 180 from the current angle, neutralizing the changes, making it point upwards again
    //if the user decides to hover out of the dd menu, that's it. back to normal, just add another 180
    //but what if the user decides to hover over tab again?? well, I tried to keep the arrow up
    //but I couldn't, no matter how much I tried, my braincells just weren't cut out for it
    //and the arrow spins around instead, so I guess I'll just keep that
    //can't be bothered fixing it so I'll just make it a feature
    //refuse to acknowledge your problem and you won't have to think of a solution

    let angle;
    const tab = document.querySelector('.tab');
    const tabd = document.querySelector('.tab.d');
    const arrow = document.querySelector('.arrow');
    const arrowd = document.querySelector('.arrow.d');
    const dropdownMenum = document.querySelector('.dropdownMenu.m');
    const dropdownMenud = document.querySelector('.dropdownMenu.d');

    const rotateArrow = (victim, degrees) => {
        victim.style.transform = `rotate(${degrees}deg)`;
    };

    const oeven = (n) => (n % 2 == 0 ? 'even' : 'odd');

    const tabEnterSpin = (element, arrowElement) => {
        element.addEventListener('mouseenter', () => {
            if (!arrowElement.style.transform) {
                angle = 0;
            } else {
                angle = parseInt(
                    arrowElement.style.transform.split('(')[1].split('d')[0]
                );
            }

            rotateArrow(arrowElement, angle + 180);
        });
    };

    const tabLeaveSpin = (element, arrowElement) => {
        element.addEventListener('mouseleave', () => {
            if (!arrowElement.style.transform) {
                angle = 0;
            } else {
                angle = parseInt(
                    arrowElement.style.transform.split('(')[1].split('d')[0]
                );
            }

            if (oeven(angle / 180) == 'even') {
                rotateArrow(arrowElement, angle - 180);
            } else {
                rotateArrow(arrowElement, angle + 180);
            }
        });
    };

    const ddEnterSpin = (element, arrowElement) => {
        element.addEventListener('mouseenter', () => {
            if (!arrowElement.style.transform) {
                angle = 0;
            } else {
                angle = parseInt(
                    arrowElement.style.transform.split('(')[1].split('d')[0]
                );
            }

            if (oeven(angle / 180) == 'even') {
                rotateArrow(arrowElement, angle - 180);
            } else {
                rotateArrow(arrowElement, angle + 180);
            }
        });
    };

    const ddLeaveSpin = (element, arrowElement) => {
        element.addEventListener('mouseleave', () => {
            if (!arrowElement.style.transform) {
                angle = 0;
            } else {
                angle = parseInt(
                    arrowElement.style.transform.split('(')[1].split('d')[0]
                );
            }

            if (oeven(angle / 180) == 'odd') {
                rotateArrow(arrowElement, angle + 180);
            } else {
                rotateArrow(arrowElement, angle - 180);
            }
        });
    };

    //handle hover events
    tabEnterSpin(tab, arrow);
    tabLeaveSpin(tab, arrow);
    tabEnterSpin(tabd, arrowd);
    tabLeaveSpin(tabd, arrowd);
    ddEnterSpin(dropdownMenum, arrow);
    ddLeaveSpin(dropdownMenum, arrow);
    ddEnterSpin(dropdownMenud, arrowd);
    ddLeaveSpin(dropdownMenud, arrowd);

    //some declarations
    const dropdownMenu = document.querySelector('.dropdownMenu.d');
    let selectedMonth;
    let selectedDay;
    let smonth;
    let sday;

    const months = document.querySelectorAll('.item.m');

    //set days as an empty array, since we (I) need it as a global variable
    let days = [];

    //loop over each month and listen for a click, if triggered, run these
    months.forEach((link, index) => {
        link.addEventListener('click', () => {
            //indices start at 0, so we (I) add one for it to be comprehensible to the human mind
            selectedMonth = index + 1;

            //create an <a> element upon clicking on any month, and display it
            const newSmonth = document.createElement('a');
            newSmonth.classList.add('smonth');
            newSmonth.textContent = link.textContent;

            //if sday and smonth both exist, and the user still decides to click a month element, remove sday, essentially resetting the options. this prevents the user from being able to choose February 31, or other illegal dates
            if (smonth && sday) {
                const calcBtn = document.querySelector('.calculate');
                calcBtn.style.opacity = 0;
                setTimeout(() => {
                    calcBtn.remove();
                }, 100);
                const calculateButton = document.createElement('div');
                calculateButton.classList.add('ncalculate');
                const pelement = document.createElement('p');
                pelement.textContent = 'Calculate!';
                calculateButton.appendChild(pelement);
                const calcBox = document.querySelector('.calcBox');
                calcBox.appendChild(calculateButton);
                setTimeout(() => {
                    calculateButton.style.opacity = '1';
                }, 4);
                smonth.replaceWith(newSmonth);
                sday.remove();

                //replace original style with invalid
                calculateButton.classList.remove('calculate');
                calculateButton.classList.add('ncalculate');
                //reset variable so it's back to falsy
                sday = '';
            } else if (smonth) {
                //if an <a> element already exists, replace it. otherwise proceed normally
                smonth.replaceWith(newSmonth);
            } else {
                const mainElement = document.querySelector('.selecticles');
                mainElement.appendChild(newSmonth);
            }

            //replace the old variable with new one, so the program is aware
            smonth = newSmonth;

            //days dd creation
            const ddd = document.querySelector('.dropdown.d');

            //come back here when I tell you to
            const monthEnd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            //delete any existing day items if there are, otherwise they'd stack up (like it goes from 31 to 01, then up to 31 again)
            const existingDays = document.querySelectorAll('.item.d');
            existingDays.forEach((day) => day.remove());

            //dynamically add days from 01-31 depending on the month they chose. it checks the index of monthEnd with the number of the month the user chooses. for example they choose February. that has a value of 2, and we check the 2nd index of monthEnd. it returns 28, and we limit it to that much. can't have them selecting February 31 or something
            for (let i = 1; i <= monthEnd[selectedMonth - 1]; i++) {
                //if number is below 10, add a 0 beside them
                const day = i < 10 ? `0${i}` : i;

                //<a> element creation
                const newA = document.createElement('a');
                newA.classList.add('item', 'd');
                newA.textContent = day;
                dropdownMenu.appendChild(newA);
            }

            //another declaration
            days = document.querySelectorAll('.item.d');

            //only display the days dropdown menu as block when a month element is clicked (so they can't choose a day before choosing a month (because I'm too lazy to handle that))
            ddd.style.display = 'block';

            //if there are both selected days and months, asign the signs and sign descriptions to their appropriate values
            if (smonth && sday) {
                sign = zodialc(selectedMonth, selectedDay);
                signDesc = zodesc(selectedMonth, selectedDay);
                console.log(
                    'Selected month and day:',
                    selectedMonth,
                    selectedDay
                );

                //creation of calculate button
                const calculateButton = document.createElement('div');
                calculateButton.classList.add('calculate');
                const pelement = document.createElement('p');
                pelement.textContent = 'Calculate!';
                calculateButton.appendChild(pelement);
                const calcBox = document.querySelector('.calcBox');
                calcBox.appendChild(calculateButton);

                //set a teenie weenie amount of delay so it has time to animate in
                setTimeout(() => {
                    calculateButton.style.opacity = '1';
                }, 4);
            }
        });
    });

    //retrieve json file
    let zodiacSigns;
    fetch('zodiac.json')
        .then((response) => response.json())
        .then((data) => {
            zodiacSigns = data.zodiacSigns;
        })
        .catch((error) => console.error(error));

    //ending days for each zodiac sign in each month
    const signEnd = [20, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];

    //zodiac calculator (returns title)
    const zodialc = (month, day) => {
        if (day <= signEnd[month - 1]) {
            return zodiacSigns[month - 1].title;
        } else {
            return zodiacSigns[month % 12].title;
        }
    };

    //zodiac calculator (returns description)
    const zodesc = (month, day) => {
        if (day <= signEnd[month - 1]) {
            return zodiacSigns[month - 1].description;
        } else {
            return zodiacSigns[month % 12].description;
        }
    };

    //declare here, but no value yet because we need an event for that
    let sign;
    let signDesc;

    main.addEventListener('click', (event) => {
        //checks if the main class is 'item', and subclass is 'd'. that means it's the element we're (I'm) looking for
        if (
            `${event.target.classList[0]} ${event.target.classList[1]}` ==
            'item d'
        ) {
            if (!selectedMonth) {
                return;
            }

            //turn the string into an integer (because we gonna need that to access an array's index)
            selectedDay = parseInt(event.target.textContent);

            //creation of new selected day
            const newSday = document.createElement('a');
            newSday.classList.add('sday');
            newSday.textContent = event.target.textContent;

            //if a selected day already exists, replace it. otherwise proceed as normal
            if (sday) {
                sday.replaceWith(newSday);
            } else {
                const mainElement = document.querySelector('.selecticles');
                mainElement.appendChild(newSday);
            }

            //blah blah update blah blah whatever
            sday = newSday;

            //it's the same process with the selected month
            if (smonth && sday) {
                sign = zodialc(selectedMonth, selectedDay);
                signDesc = zodesc(selectedMonth, selectedDay);
                console.log(
                    'Selected month and day:',
                    selectedMonth,
                    selectedDay
                );

                //creation of calculate button
                const calculateButton = document.createElement('div');
                calculateButton.classList.add('calculate');
                const pelement = document.createElement('p');
                pelement.textContent = 'Calculate!';
                calculateButton.appendChild(pelement);
                const calcBox = document.querySelector('.calcBox');
                calcBox.appendChild(calculateButton);

                //set a teenie weenie amount of delay so it has time to animate in
                setTimeout(() => {
                    calculateButton.style.opacity = '1';
                }, 4);
            }
        }
    });

    //declare calcBox and return if it doesn't exist
    const calcBox = document.querySelector('.calcBox');
    if (!calcBox) return;

    calcBox.addEventListener('click', (event) => {
        //trigger if either the text or div is click (because I didn't bother to use the button tag)
        if (event.target.closest('.calculate')) {
            console.log(`Your Zodiac sign is ${sign}`);

            //creation of the popup screen with results
            const body = document.querySelector('body');
            const poppy = document.createElement('div');
            const allDim = document.createElement('div');
            const poppyPop = document.createElement('p');
            const poppyDesc = document.createElement('p');
            const poppyTitle = document.createElement('p');
            const poppyImg = document.createElement('img');
            poppyTitle.classList.add('poppyTitle');
            poppyDesc.classList.add('poppyDesc');
            poppyPop.classList.add('poppyPop');
            poppyImg.setAttribute('class', 'poppyImg');

            //setting to lowercase because I named my files that way
            poppyImg.setAttribute('src', `/images/${sign.toLowerCase()}.png`);
            poppyTitle.textContent = 'Your zodiac is...';
            poppyDesc.textContent = signDesc;
            poppyPop.textContent = sign;
            poppy.appendChild(poppyImg);
            poppy.appendChild(poppyTitle);
            poppy.appendChild(poppyPop);
            poppy.appendChild(poppyDesc);
            poppy.classList.add('poppy');
            allDim.classList.add('allDim');
            body.appendChild(allDim);
            body.appendChild(poppy);
            setTimeout(() => {
                poppy.style.opacity = '1';
                allDim.style.opacity = '1';

                //remove both elements if user clicks outside the main popup (give em freedom)
                allDim.addEventListener('click', () => {
                    allDim.remove();
                    poppy.remove();
                });
            }, 4);
        }
    });

    //gliding effect mouse sway thing
    const floatingDiv = document.querySelector('.forHover');
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const shiftX = (mouseX - centerX) / 20;
        const shiftY = (mouseY - centerY) / 20;

        floatingDiv.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    });
});

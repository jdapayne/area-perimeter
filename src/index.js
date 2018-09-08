import {propByString, randElem, randBetween} from "Utilities/Utilities"
import Triangle from "Question/Triangle"
import TriangleView from "QuestionView/TriangleView"

window.addEventListener("DOMContentLoaded", function () {
        App.init();
});

export default function App () {}

/* Initialisation: Sets up click handlers etc */
App.init = function () {
    App.settings.toPage();

    document.getElementById("generate").addEventListener("click", function(e) {
        e.preventDefault();
        App.generateAll();
    });

    document.getElementById("showoptions").addEventListener("click",App.toggleOptions);

    document.getElementById("display-box").addEventListener("click", function(e) {
        let elem = e.target;
        if (elem.classList.contains("refresh")) {
            let q_container = elem.closest(".question-container");
            let q_index = q_container.dataset.question_index;
            App.hideAnswer(q_index);
            App.generate(q_index);
        } else if (elem.classList.contains("answer-toggle")) {
            let q_container = elem.closest(".question-container");
            let q_index = q_container.dataset.question_index;
            App.toggleAnswer(q_index,elem);
        }
    });

    document.getElementById("show-answers").addEventListener("click",App.toggleAllAnswers);

    document.addEventListener("change", function(e) {
        App.settings.fromPage();
        if (e.target.name === "options-type") {
            App.toggleHidden(["options-advanced","options-simple"]);
        }
    });

    document.getElementById("zoom").addEventListener("click", function(e) {
        const elem = e.target;
        if (elem.id === 'zoomin') {
            App.zoom(1);
        } else if (elem.id == 'zoomout') {
            App.zoom(-1); 
        }
    });

    document.body.addEventListener("click", function (event) {
        const e = event.target;
        if (e.dataset.modal) {App.modalOpen(e.dataset.modal); event.preventDefault()}
    });

    document.getElementById("modal-overlay").addEventListener("click", function (event) {
        if (event.target.closest(".modal")) return;
        else App.modalClose()
    });
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* UI control */
App.toggleOptions = function (e) {
    let showoptions = document.getElementById("showoptions");
    let is_hidden = document.getElementById("options").classList.toggle("hidden");

    if (is_hidden) {
        showoptions.innerHTML = "Show options";
    } else {
        showoptions.innerHTML = "Hide options";
    }

    if (e) {e.preventDefault()}
}

App.toggleAnswer = function (i,e) {
    let answered = App.questions[i].viewobject.toggleAnswer();
    App.draw(i);
    let container = App.questions[i].container;
    container.classList.toggle("answer");
    let toggle = container.querySelector(".answer-toggle");
    if (answered) toggle.innerHTML = "Hide answer";
    else toggle.innerHTML = "Show answer";
};

App.showAnswer = function (i) {
    App.questions[i].viewobject.showAnswer();
    App.draw(i);
    let container = App.questions[i].container;
    container.classList.add("answer");
    container.querySelector(".answer-toggle").innerHTML = "Hide answer";
};

App.hideAnswer = function (i,e) {
    App.questions[i].viewobject.hideAnswer();
    App.draw(i);
    let container = App.questions[i].container;
    container.classList.remove("answer");
    container.querySelector(".answer-toggle").innerHTML = "Show answer";
};

App.hideAllAnswers = function () {
    App.questions.forEach( function(q,i) { App.hideAnswer(i) });
    document.getElementById("show-answers").innerHTML = "Show answers";
    App.answered = false;
}

App.showAllAnswers = function () {
    App.questions.forEach( function(q,i) { App.showAnswer(i) });
    document.getElementById("show-answers").innerHTML = "Hide answers";
    App.answered = true;
}

App.toggleAllAnswers = function (e) {
    if (App.answered) App.hideAllAnswers();
    else App.showAllAnswers();
    if (e) {e.preventDefault()}
}

App.answered = false;
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * Question selection/object creation * * */
/*
App.chooseQDifficulty = function (difficulty) {
    // choose question at random - given type options, with given difficulty.
    // Aim - avoid and DOM interaction with these.
    const type = App.randomType();
    const anglesum = type === 'aosl' ? 180 :
                     type === 'aaap' ? 360 :
    switch(difficulty) {
        case 1:
            return App.chooseQ(type,"simple",{n: 2});
        case 2:
            return App.chooseQ(type,"simple",{n: 3});
        case 3:
            return App.chooseQ(type,"repeated", {n:3});
        case 4:
            return App.chooseQ(type,"algebra", {types: ['mult'], constants: false, ensure_x: false, min_n:3, max_n:4});
        case 5:
            return App.chooseQ(type,"algebra", {types: ['add','mult'], constants: ['mult'], ensure_x: true, min_n: 2, max_n: 3});
        case 6:
            return App.chooseQ(type,"algebra", {types: ['mixed'], min_n: 2, max_n: 3});
        case 7:
            return App.chooseQ(type,"worded", {types: [Math.random()<0.5 ? 'add':'multiply'], n:2});
        case 8:
            return App.chooseQ(type,"worded", {types: ['add','multiply'], n:3});
        case 9:
            return App.chooseQ(type,"worded", {types: ['multiply','ratio'], n:3});
        case 10:
            return App.chooseQ(type,"worded", {types: ['add','multiply','ratio','percent'], n:3});
        default:
            return App.chooseQ(type,"simple",{n: 2});
    }
}
*/

App.chooseQRandom = function () {
    // choose based on options for type and subtupes available
    const shape = randElem(App.settings.shapes);
    const type = randElem(App.settings.types);
    return App.chooseQ(shape,type,App.settings.options);
}

App.chooseQ = function (shape, type, options) {
    return new Triangle(100,type);
}

App.makeView = function (question,rotation) {
    let view = new TriangleView(question,App.settings.canvas_width,App.settings.canvas_height,rotation,);
    return view;
};

/* * * Question drawing control * * */
App.clear = function () {
    document.getElementById("display-box").innerHTML = "";
    App.questions = []; // cross fingers that no memory leaks occur
    //dunno if this should go here or somewhere else...
    document.getElementById("show-answers").removeAttribute("disabled");
    App.hideAllAnswers();
};

App.draw = function (i) {
    // redraws ith question
    const view = App.questions[i].viewobject;
    const canvas = App.questions[i].container.querySelector("canvas");
    view.drawIn(canvas);
};

App.reDraw = function (x) {
    // x is either index of a question, or an App.questions object
    // re-generates view for ith question and draws it
    // Mainly used for when widh/height changes

    const q = typeof(x) === 'number' ? App.questions[x] : x;
    
    const canvas = q.container.querySelector("canvas");
    canvas.width = App.settings.canvas_width;
    canvas.height = App.settings.canvas_height;

    const oldview = q.viewobject;
    const question = oldview.question;
    const newview = App.makeView(question,oldview.rotation);

    q.viewobject = newview;
    newview.drawIn(canvas);
}

App.drawAll = function () {
    App.questions.forEach( function (q) {
        const view = q.viewobject;
        const canvas = q.container.querySelector("canvas");
        view.drawIn(canvas);
    });
}

App.generate = function (i) {
  // Generates a question and represents it at the given index
  try {
    let question;
    if (App.settings.options_mode === 'basic') {
        let difffloat = App.settings.mindiff + i * (App.settings.maxdiff - App.settings.mindiff + 1)/App.settings.n_questions 
        let diff = Math.floor(difffloat); 
        console.log("difficulty for " + i + " : " + difffloat + " -> " + diff);
        question = App.chooseQDifficulty(diff);
    } else {
        question = App.chooseQRandom() 
    }

    let view = App.makeView(question);
    
    App.questions[i] = Object.assign({},App.questions[i], {
        viewobject: view,
        type: question.type,
        subtype: question.subtype
    });

    App.draw(i);
  } 
  catch (e) {
    if (e === "too_close") {
        App.generate(i);
    }
    else throw e;
  }
};

App.generateAll = function () {
    App.clear();
    // Create containers for questions and generate a question in each container
    let n = App.settings.n_questions;
    for (let i=0; i<n; i++) {
        // Make DOM elements
        let container = document.createElement("div");
        container.className = "question-container";
        container.dataset.question_index = i;

        let canvas = document.createElement("canvas");
        canvas.width = App.settings.canvas_width;
        canvas.height = App.settings.canvas_height;
        canvas.className = "question-view";
        container.append(canvas);

        let refresh = document.createElement("img");
        refresh.src = "refresh.png"; // might be better to do something clever with webpack
        refresh.className = "refresh";
        refresh.width = 15;
        refresh.height = 15;
        container.append(refresh);

        let answer_toggle = document.createElement("div");
        answer_toggle.innerHTML = "Show answer";
        answer_toggle.className = "answer-toggle";
        container.append(answer_toggle);

        document.getElementById("display-box").append(container);

        App.questions[i] = Object.assign({},App.questions[i], {
            container: container
        });

        // Make question and question view
        App.generate(i);
    }
};
/* * * * * * * * * * * * * * * * * * * * */

App.zoom = function (sign) {
    App.settings.zoom += sign*0.1;
    App.settings.canvas_width = App.settings.canvas_width_base * App.settings.zoom;
    App.settings.canvas_height = App.settings.canvas_height_base * App.settings.zoom;

    App.questions.forEach( function (q) {
        App.reDraw(q)
    });
}

/* * * Data on generated questions * * *
 *******************************************************************************************************
 * Example:
 * App.questions =
 *  [
 *      {shape: "triangle", type: "area", viewobject: [QuestionView object], container: [Node]},
 *  ]
 *
 */  App.questions = [];
/*
/********************************************************************************************************/

/* * * Settings related * * */
App.defaults = {
    canvas_width: 250,
    canvas_height: 250,
    radius: 100
};

App.settings = {
    canvas_width_base: 300,
    canvas_height_base: 300,
    canvas_width: 300,
    canvas_height: 300,
    zoom: 1,
    shapes: new Set(["triangle"]),
    types: new Set(["perimeter","area","rev-area","rev-perimeter"]),
    mindiff: 1,
    maxdiff: 5,
    n_questions: 8,
    options: {
        mix_units: true
    }
}

App.settings.fromPage = function() {
    const formOptions = document.getElementsByClassName("option");
    for (let i = 0, n=formOptions.length; i<n; ++i) {
        const settingElem = formOptions[i];
        const value = Number(settingElem.value) || settingElem.value;
        let setting = settingElem.dataset.setting;
        //TODO: Make it work with radio buttons
        if (setting.endsWith("[]")) { //modify a set from checkboxes
            setting = setting.slice(0,-2);
            if (!propByString(this,setting)) propByString(this,setting, new Set()); 
            // TODO: convert array to Set if needed
            if (settingElem.checked) propByString(this,setting).add(value);
            else propByString(this,setting).delete(value);
        } else if (settingElem.type === "checkbox") {
            propByString(this,setting,settingElem.checked?true:false)
        } else if (settingElem.checked || (settingElem.type !== "radio" && settingElem.type !== "checkbox")) {
            propByString(this,setting,value);
        }
    }
console.log("settings updated:");
console.log(this);
}

App.settings.toPage = function() {
    const formOptions = document.getElementsByClassName("option");
    for (let i = 0, n=formOptions.length; i<n; ++i) {
        const settingElem = formOptions[i];
        const value = settingElem.value;
        let setting = settingElem.dataset.setting;
        if (setting.endsWith("[]")) { //modify a set from checkboxes
            setting = setting.slice(0,-2);
            // TODO: convert array to Set if needed
            if (propByString(this,setting).has(value)) settingElem.checked = true;
            else settingElem.checked = false;
        } else if (settingElem.type === "radio") {
            if (propByString(this,setting) === value) settingElem.checked = true;
        } else if (settingElem.type === "checkbox") {
            settingElem.checked = propByString(this,setting)? true : false;
        } else {
            settingElem.value = propByString(this,setting);
        }
    }
}

App.modalOpen = function (id) {
    const modal = document.getElementById(id) || document.getElementById("default-modal");
    if (modal.classList.contains("modal")) {
        const overlay = document.getElementById("modal-overlay");
        overlay.appendChild(modal);
        overlay.classList.remove("hidden");
    }
}

App.modalClose = function () {
    const overlay = document.getElementById("modal-overlay");
    const children = overlay.getElementsByClassName("modal");
    while (children.length > 0) {
        document.body.appendChild(children[0]);
    }
    overlay.classList.add("hidden");
}

App.toggleHidden = function (idlist) {
    for (let i = 0; i<idlist.length; i++) {
        document.getElementById(idlist[i]).classList.toggle("hidden");
    }
}

/* * * * * * * * * * * * * * * * * * * * */

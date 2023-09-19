import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import React from 'https://esm.sh/react@18.2.0';
// notes app
class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [
                { note: "Walk the dog",
                    active: true,
                    key: 0 },
                { note: "Buy groceries",
                    active: true,
                    key: 1 },
                { note: "Do laundry",
                    active: true,
                    key: 2 },
                { note: "Go outside",
                    active: true,
                    key: 3 },
                { note: "Drink water & take meds",
                    active: true,
                    key: 4 }
            ],
            val: "",
            sort: "all",
            active: 5,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }
    // update state on change within textarea
    handleChange(e) {
        this.setState({ val: e.target.value });
    }
    // clear out all completed notes
    handleClick() {
        this.setState(prevState => ({
            notes: prevState.notes.filter(elem => elem.active)
        }));
        this.setState(prevState => ({
            notes: prevState.notes.map((el, i) => { return Object.assign(Object.assign({}, el), { key: i }); })
        }));
    }
    // add new note by pressing enter & update count
    handleKeyDown(e) {
        if (e.key === "Enter") {
            this.setState({
                notes: this.state.notes.concat({
                    note: this.state.val,
                    active: true,
                    key: this.state.notes.length
                })
            });
            this.setState({ val: "" });
            e.preventDefault();
            let activeSum = this.state.notes.filter(elem => elem.active).reduce((accum, elem) => ++accum, -1);
            this.setState({ active: activeSum + 1 });
            this.handleReload();
        }
    }
    // add event listeners
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
        // handle checked/unchecked notes, sorted notes
        document.addEventListener("click", (e) => {
            let key = e.target.value;
            let activeNotes = this.state.notes.filter(elem => elem.active);
            let activeSum = activeNotes.length - 1;
            // reload page after click
            let memoState = this.state.sort;
            this.setState({ sort: "all" });
            this.setState({ sort: memoState });
            // handle sorting
            if (e.target.value == "all" || e.target.value == "active" || e.target.value == "completed") {
                // manage active buttons style
                let myBtns = document.querySelectorAll('#sort-buttons > button');
                myBtns.forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");
                // manage state
                this.setState({ sort: e.target.value });
                this.handleReload();
            }
            else if (e.target.checked) {
                this.setState(prevState => ({
                    notes: prevState.notes.map(el => el["key"] == key ? Object.assign(Object.assign({}, el), { active: false }) : el)
                }));
                this.setState({ active: activeSum });
                this.handleReload();
            }
            else if (e.target.id != "add-todo") {
                this.setState(prevState => ({
                    notes: prevState.notes.map(el => el["key"] == key ? Object.assign(Object.assign({}, el), { active: true }) : el)
                }));
                let activeNotes = this.state.notes.filter(elem => elem.active);
                let activeSum = activeNotes.length;
                this.setState({ active: activeSum });
                this.handleReload();
            }
        });
    }
    // set style for checked/unchecked notes
    handleReload() {
        let arr = [];
        if (this.state.sort === "all")
            arr = this.state.notes;
        else if (this.state.sort === "active")
            arr = this.state.notes.filter(elem => elem.active);
        else
            arr = this.state.notes.filter(elem => !elem.active);
        arr.map((elem) => {
            let target = document.getElementById(elem["key"]);
            if (elem.active) {
                target.style.setProperty("text-decoration", "none");
                target.style.setProperty("color", "black");
            }
            else {
                target.style.setProperty("text-decoration", "line-through");
                target.style.setProperty("color", "#a4a4a4");
            }
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { id: "list" },
                this.state.sort == "all" &&
                    this.state.notes.map((elem) => {
                        return React.createElement("label", null,
                            !elem.active ? React.createElement("input", { type: "checkbox", value: elem.key, defaultChecked: true })
                                : React.createElement("input", { type: "checkbox", value: elem.key }),
                            React.createElement("span", { id: elem.key }, elem.note),
                            React.createElement("br", null));
                    }),
                this.state.sort == "active" &&
                    this.state.notes.filter(elem => elem["active"]).map((elem) => {
                        return React.createElement("label", null,
                            React.createElement("input", { type: "checkbox", value: elem.key }),
                            React.createElement("span", { id: elem.key }, elem.note),
                            React.createElement("br", null));
                    }),
                this.state.sort == "completed" &&
                    this.state.notes.filter(elem => !elem["active"]).map((elem) => {
                        return React.createElement("label", null,
                            React.createElement("input", { type: "checkbox", value: elem.key, defaultChecked: true }),
                            React.createElement("span", { id: elem.key }, elem.note),
                            React.createElement("br", null));
                    })),
            React.createElement("div", { id: "textarea" },
                React.createElement("textarea", { rows: "2", cols: "40", placeholder: "What needs to be done?", id: "add-todo", onChange: this.handleChange, value: this.state.val })),
            React.createElement("div", { id: "upper-bar" },
                React.createElement("span", { id: "items" },
                    this.state.active,
                    " ",
                    this.state.active != 1 ? "items" : "item",
                    " left"),
                React.createElement("div", { id: "sort-buttons" },
                    React.createElement("button", { value: "all", className: "active" }, "All"),
                    React.createElement("button", { value: "active" }, "Active"),
                    React.createElement("button", { value: "completed" }, "Completed")),
                React.createElement("button", { id: "clear", onClick: this.handleClick }, "Clear completed"))));
    }
}
ReactDOM.render(React.createElement(Notes, null), document.getElementById("main"));
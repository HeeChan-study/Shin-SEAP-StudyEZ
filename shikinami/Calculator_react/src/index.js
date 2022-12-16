import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// ちゃんと機能するのかもっとテストしてみること。
// 入力される場合をいっぱい仮定してみる。
// コードをもっと分かりやすく、読みやすくするにはどうしたらいいのかもっと考えてみること。

class Calculator extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            SellectedOperater: "",
            PreviousResult: "",
            CurrentResult: "0",

            IsSigbToggleOn: true,

            IsStackedNumber: false,
            AfterOperater: false,
        }

        //this.ClickNumberAction = this.ClickNumberAction.bind(this);
        //this.ClickOperaterAction = this.ClickOperaterAction.bind(this);
    }

    render() {
        return (
            <form className="Calculator">
            <div className="Display">
                <span className="sellect-operater">{this.state.SellectedOperater}</span>
                <span className="previous-result">{this.state.PreviousResult}</span>
                <span className="current-result">{this.state.CurrentResult}</span>
            </div>

                <div className="button">
                    <button onClick={this.ClickClearAction.bind(this)}>C</button>
                    <button onClick={this.ClickBackspaceAction.bind(this)}>B</button>
                    <button onClick={this.ClickSignChangeAction.bind(this)}>±</button>
                    <button onClick={this.ClickOperaterAction.bind(this, "×")}>×</button>

                    <button onClick={this.ClickNumberAction.bind(this, "7")}>7</button>
                    <button onClick={this.ClickNumberAction.bind(this, "8")}>8</button>
                    <button onClick={this.ClickNumberAction.bind(this, "9")}>9</button>
                    <button onClick={this.ClickOperaterAction.bind(this, "÷")}>÷</button>

                    <button onClick={this.ClickNumberAction.bind(this, "4")}>4</button>
                    <button onClick={this.ClickNumberAction.bind(this, "5")}>5</button>
                    <button onClick={this.ClickNumberAction.bind(this, "6")}>6</button>
                    <button onClick={this.ClickOperaterAction.bind(this, "－")}>－</button>

                    <button onClick={this.ClickNumberAction.bind(this, "1")}>1</button>
                    <button onClick={this.ClickNumberAction.bind(this, "2")}>2</button>
                    <button onClick={this.ClickNumberAction.bind(this, "3")}>3</button>
                    <button onClick={this.ClickOperaterAction.bind(this, "＋")}>＋</button>

                    <button onClick={this.ClickNumberAction.bind(this, "0")}>0</button>
                    <button onClick={this.ClickNumberAction.bind(this, "00")}>00</button>
                    <button onClick={this.ClickNumberAction.bind(this, ".")}>.</button>
                    <button onClick={this.ClickOperaterAction.bind(this, "＝")}>＝</button>
                </div>
            </form>
        );
    }

    ClickNumberAction = (value, e) => {
        e.preventDefault();

        if (this.state.AfterOperater) {

            if (this.state.SellectedOperater) {
                this.setState({PreviousResult: this.state.CurrentResult,
                    IsStackedNumber: true,
                })
            };

            if (value === "00")
                this.setState({CurrentResult: "0"});
            else if (value === ".")
                this.setState({CurrentResult: "0."});
            else 
                this.setState({CurrentResult: value});

            this.setState({AfterOperater: false});
        }

        else if (this.state.CurrentResult === "0" && value === "00")
            return false;

        else if (value === "." && this.state.CurrentResult.indexOf(".") !== -1)
            return false;

        else if (this.state.CurrentResult === "0" && value !== ".")
            this.setState({CurrentResult: value});

        else
            this.setState({CurrentResult: this.state.CurrentResult + value});
    }

    ClickOperaterAction = (value, e) => {
        e.preventDefault();

        if (this.state.IsStackedNumber && !this.state.AfterOperater) {
            if (this.state.SellectedOperater === "＋")
                this.setState({CurrentResult: (Number(this.state.PreviousResult) + Number(this.state.CurrentResult)).toString()})

            else if (this.state.SellectedOperater === "－")
                this.setState({CurrentResult: (Number(this.state.PreviousResult) - Number(this.state.CurrentResult)).toString()})

            else if (this.state.SellectedOperater === "×")
                this.setState({CurrentResult: (Number(this.state.PreviousResult) * Number(this.state.CurrentResult)).toString()})

            else if (this.state.SellectedOperater === "÷")
                this.setState({CurrentResult: (Number(this.state.PreviousResult) / Number(this.state.CurrentResult)).toString()})
        }

        this.setState({AfterOperater: true,
            PreviousResult: "",
        })

        if (value === "＝") {
            this.setState({SellectedOperater: ""})
        } else {
            this.setState({SellectedOperater: value})
        }
    }
    
    ClickSignChangeAction = (e) => {
        e.preventDefault();

        if (!this.state.AfterOperater) {
            if (this.state.IsSigbToggleOn)
            {
                this.setState({CurrentResult: "-" + this.state.CurrentResult,
                    IsSigbToggleOn: false,
                })
            } else {
                this.setState({CurrentResult: this.state.CurrentResult.slice(1),
                    IsSigbToggleOn: true,
                })
            }
        }
    }

    ClickClearAction = (e) => {
        e.preventDefault();

        this.setState({SellectedOperater: "",
            PreviousResult: "",
            CurrentResult: "0",
            
            IsSigbToggleOn: true,

            IsStackedNumber: false,
            AfterOperater: false,
        })
    }

    ClickBackspaceAction = (e) => {
        e.preventDefault();

        if (this.state.CurrentResult.length === 1) 
            this.setState({CurrentResult: "0"})

        else //if (this.state.CurrentResult) 
            this.setState({CurrentResult: this.state.CurrentResult.slice(0, -1)})
    }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Calculator />)
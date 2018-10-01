import React, {Component} from 'react';
import texts from "./texts";

class TextDisplay extends Component {
    state = {
        current: null
    };

    constructor(props) {
        super(props);

        this.setCurrent(0).finally();
    }

    async setCurrent(i) {
        if (!texts[i].hasOwnProperty('text')) {
            const response = await fetch(texts[i].url);
            texts[i].text = await response.text();
        }
        this.setState({current: texts[i]})
    }

    render() {
        const {current} = this.state;

        return (
            <div className="TextDisplay">
                {current && (
                    <p>
                        {current.text}
                    </p>
                )}
            </div>
        )
    }
}

export default TextDisplay;

import React, { Component } from 'react'

import CardComponent from './CardComponent'

class CardContainer extends Component {

    constructor(props) {
        super(props)

        this.state = {
            articles: []
        }
    }

    componentDidMount() {
        fetch('http://localhost:8080/guardian_news')
            .then(response => response.json())
            .then(response => {
                console.log(response.data)
                const {articles} = response.data
                this.setState({ articles: articles })
                console.log(this.state.articles)
            })
        // console.log('componentDidMount')
        // if (this.props.source === 'guardian')  {
        //     fetch('http://localhost:8080/guardian_news')
        //         .then(response => response.json())
        //         .then(response => {
        //             console.log(response)
        //             const articles = response.data
        //             this.setState({ articles: articles })
        //         })
        // } else {
        //     fetch('http://localhost:8080/guardian_news')
        //         .then(response => response.json())
        //         .then(response => {
        //             console.log(response)
        //             const articles = response.data
        //             this.setState({ articles: articles })
        //         })
        // }
    }

    render() {
        console.log(this.state.articles)
        return (
            <div>
                {this.state.articles.length > 0
                    ? <h2>{this.state.articles[0].title}</h2>
                    : <h2>Loading...</h2>
                }
                {/*/!*<CardComponent source={ this.props.source } articles={this.state.articles} />*!/*/}
                {/*<h2>{this.state.articles[0].title}</h2>*/}
            </div>
        )
    }
}

export default CardContainer
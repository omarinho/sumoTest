 'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import { FormErrors } from './FormErrors';

export default class ShowEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            subject: '',
            editorState: EditorState.createEmpty(),
            formErrors: {subject: '', body: '', network: ''},
            subjectValid: false,
            bodyValid: false,
            networkValid: false,
            formValid: false,
            disabledButton: false,
            successMesage: false,
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => this._onChange(editorState);
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.handleSubjectInput = (e) => this._handleSubjectInput (e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);    
        this.validateFields = () => this._validateFields();
        this.validateForm = () => this._validateForm();
        this.errorClass = (error) => this._errorClass(error);
        this.tryToSave = () => this._tryToSave();
    }

    componentDidMount() {
        fetch(this.props.appurl + '/get/' + this.props.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if ( (typeof responseJson.success != 'undefined') && (responseJson.success == 'yes') ) {
                this.setState({
                    subject: responseJson.data.subject,
                    editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(responseJson.data.body))),
                });
            }
            else {
                window.location = this.props.appurl + '/home'; 
            }
        })
        .catch((error) => {
            window.location = this.props.appurl + '/home'; 
        });
    }

    _tryToSave() {
        if (this.state.formValid) {
            let fieldValidationErrors = this.state.formErrors;
            let contentState = this.state.editorState.getCurrentContent();
            let content = JSON.stringify(convertToRaw(contentState));
            fetch(this.props.appurl + '/update/' + this.props.id, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _token: getMeta('csrf-token'),
                    subject: this.state.subject,
                    content: content,
                }), 
            })
            .then((response) => response.json())
            .then((responseJson) => {
                let serverError = false;
                if ( (typeof responseJson.success != 'undefined') && (responseJson.success == 'yes') ) {
                    this.setState({
                        successMesage: true,
                        disabledButton: false,
                    });
                    window.scrollTo(0, 0);
                }
                else {
                    fieldValidationErrors.network = 'Server error. Please, try again.';
                    this.setState({
                        networkValid: false,
                        formErrors: fieldValidationErrors,
                        disabledButton: false
                    });
                }
            })
            .catch((error) => {
                fieldValidationErrors.network = 'Network issue. Are you connected to Internet?';
                this.setState({
                    networkValid: false,
                    formErrors: fieldValidationErrors,
                    disabledButton: false
                });
            });
        }
        else {
            this.setState({
                disabledButton: false
            });
        }
    }

    _validateForm() {
        this.setState({
            formValid: this.state.subjectValid && this.state.bodyValid && this.state.networkValid
        }, this.tryToSave);
    }

    _validateFields() {
        let fieldValidationErrors = this.state.formErrors;
        let subjectValid = this.state.subjectVal;
        let bodyValid = this.state.bodyValid;
        let networkValid = this.state.networkValid;

        if ( !!(this.state.subject) ) {
            subjectValid = true;
            fieldValidationErrors.subject = '';
        } 
        else {
            subjectValid = false;  
            fieldValidationErrors.subject = 'Subject is required.';
        }

        if (this.state.editorState.getCurrentContent().hasText()) {
            bodyValid = true;
            fieldValidationErrors.body = '';  
        }
        else {
            bodyValid = false;
            fieldValidationErrors.body = 'Body cannot be empty.';  
        }

        networkValid = true;
        fieldValidationErrors.network = '';

        this.setState({
            formErrors: fieldValidationErrors,
            subjectValid: subjectValid,
            bodyValid: bodyValid,
            networkValid: networkValid,
        }, this.validateForm);
    }

    _handleSubmit(event) {
        this.setState({
            disabledButton: true
        }, this.validateFields)
        event.preventDefault();
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _handleSubjectInput (e) {
        this.setState({
            subject: e.target.value,
            successMesage: false,
        });
    }

    _onChange(editorState) {
        this.setState({
            editorState: editorState,
            successMesage: false,
        });
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    _errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }

    render() {

        const {editorState} = this.state;

        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header"><h1>Show / Edit Email</h1></div>
                            <div className="panel panel-default">
                                <FormErrors formErrors={this.state.formErrors} />
                            </div>
                            <div className="panel panel-default">
                                {this.state.successMesage && 
                                    <div className="alert alert-success" role="alert">
                                        The email has been updated successfully! - <a href={this.props.appurl + '/home'}>Return to list</a>
                                    </div>
                                }
                            </div>
                            <form onSubmit={this._handleSubmit}>
                                    
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Subject:</span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" value={this.state.subject} 
                                        onChange={(event) => this.handleSubjectInput(event)} />
                                </div>
                                    
                                <div className="input-group">
                                    <span style={styles.bodyLabel} className="input-group-text">Body</span>
                                    <br/>
                                    <div className="RichEditor-root">
                                        <BlockStyleControls
                                            editorState={editorState}
                                            onToggle={this.toggleBlockType}
                                        />
                                        <InlineStyleControls
                                            editorState={editorState}
                                            onToggle={this.toggleInlineStyle}
                                        />
                                        <div className={className} onClick={this.focus}>
                                            <Editor
                                                blockStyleFn={getBlockStyle}
                                                customStyleMap={styleMap}
                                                editorState={editorState}
                                                handleKeyCommand={this.handleKeyCommand}
                                                onChange={this.onChange}
                                                placeholder="Enter the content here..."
                                                ref="editor"
                                                spellCheck={true}
                                            />
                                        </div>
                                    </div>                                    
                                </div>
                                <br/>

                                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={this.state.disabledButton}>Update this email</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }
        return (
            <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  },
  bodyLabel: {
    backgroundColor: '#E9ECEF',
  }
};

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

if (document.getElementById('ShowEmail')) {
    const element = document.getElementById('ShowEmail')
    const props = Object.assign({}, element.dataset)
    ReactDOM.render(<ShowEmail {...props}/>, document.getElementById('ShowEmail'));
}

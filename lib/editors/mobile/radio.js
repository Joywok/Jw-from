import {Radio, TextareaItem} from 'jw-components-mobile';
import React,{PropType,Component} from 'react';
const RadioItem = Radio.RadioItem;
class Radios extends Component {

  constructor(props) {
    super(props);
    this.state = {
      schema: this.props.schema
    } 
  }
  

  getLabel(txt){
      if(txt){
        return <div className="label ant-form-item-label" dangerouslySetInnerHTML={{__html:txt}}></div>
      }else{
        return ''
      }
  }
  onChange(value,schema){
    this.props.onChange(value,schema);
    let propsSchema = this.props.schema;
    if(propsSchema['events'] && propsSchema['events']['onChange']){
      propsSchema['events']['onChange'].call(this,arguments);
    }
  }

  onClick(e){
    var _focusElem = null; //输入框焦点
    if($(e.target).is(":focus")){
    }else{
      if (/(iPhone|iOS)/i.test(navigator.userAgent)) {
         $(e.target).focus();
         _focusElem = e.target || e.srcElement;
         _focusElem.scrollIntoView()
         _focusElem.scrollIntoViewIfNeeded(true);
      }
    }
  }
  onFocus(v){
    var _focusElem = null; //输入框焦点
    if (/(iPhone|iOS)/i.test(navigator.userAgent)) {
       _focusElem = e.target || e.srcElement;
         _focusElem.scrollIntoView()
         _focusElem.scrollIntoViewIfNeeded(true);
    }
    let self = this;
    for(var i in self.state.schema.options){
      if(self.state.schema.options[i].hasInput){
        self.onChange(self.state.schema.options[i].value, self.state.schema)    
      }
    }
    
  }
  changeData(data){
    this.props.onChange(value,schema) 
  }
  selectData(selected_schame,data){
    let self = this;
    let nowSchema = [];
    data.map(function(i,index){
      if(i.length){
        nowSchema.push(self.selectData(selected_schame,i))
      }else{
        if(i['name'] == selected_schame['name']){
          nowSchema.push(selected_schame)
        }else{
          nowSchema.push(i)
        }
      }
    })
    return nowSchema;
  }

  inputChange(item, value){

    console.log(item, value)
    let self = this;
    for(var i in self.props.schema.options){
      if(item.value == self.props.schema.options[i].value){
        self.props.schema.options[i].inputValue = value
      }
    }
    self.setState({
      schema: self.props.schema
    })

  }

  resetOptions(data){
    let self = this;
    const schemas = self["props"]['schemas'];
    let schema = self.props.schema;
    schema['options'] = data;
    let nowSchema = this.selectData(schema,schemas);
    let changeSchemas = self.props.changeSchemas;
    changeSchemas(schemas);
  }
  _init_layout(){
    let schema = this.state.schema;
    if(schema['layout'] == 'horizontal'){
      return 'layout-horizontal'
    }else if(schema['layout'] == 'vertical'){
      return 'layout-vertical'
    }else{
      return ('layout-column layout-column-'+schema['column'])
    }
  }
  render(){
    let schema = this.props.schema;
    let self = this;
    let target;
    if(schema["remote"] && (!schema['options'] || schema['options'].length==0)){
      target = schema["remote"]["loading"] ||<div className="loading-bounce ">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>;
      if(schema['remote']['fetch'] && typeof(schema['remote']['fetch'])=='function'){
        schema['remote']['fetch'](this.resetOptions.bind(this));
      }else{
        axios({
          method:schema["remote"]["method"],
          url: schema["remote"]["url"],
          data: schema["remote"]["data"]
        })
        .then((response)=>{
          console.log(response);
          self.resetOptions(response)
        })
        .catch((error)=>{
          message.error(error.toString(),2);
        })
      }
    }else{
      target = <div className="radio-list" {...schema['attr']}>
        {
          _.map(schema.options,function(item){
            if(item.hasInput){
              let inputClassName = "radio-textarea " + item.className
              return <div className="radio-list-i-1">
                <RadioItem name={item.name || item.value} key={item.value} className="radio-list-i" checked={schema.defaultValue == item.value?true:false} disabled={item["disabled"]||false} onChange={()=>self.onChange(item.value,schema)}>{item.label}</RadioItem>
                <TextareaItem className={inputClassName}  autoHeight onChange={self.inputChange.bind(self, item)} placeholder="如选择该项，请填写" value={item.inputValue}/>
              </div>
            }else{
              return <div className="radio-list-i-1">
                <RadioItem name={item.name || item.value} key={item.value} className="radio-list-i" checked={schema.defaultValue == item.value?true:false} disabled={item["disabled"]||false} onChange={()=>self.onChange(item.value,schema)}>{item.label}</RadioItem>
              </div>  
            }
            
          })
        }
      </div>;
    }

    if(schema["other"] && schema["other"]['template']){
      let Template = schema["other"]['template']
      target = <div className="Form-item-c">
                <Template children={target} target={self} changeData={self.props.changeData} changeSchemas={self.props.changeSchemas}></Template>
              </div>
    }else{
      target = <div className="Form-item-c">{target}</div>
    }

    return (
        <div className={"Form-item-w "+this._init_layout()} ref="container">
          {this.getLabel(schema.label)}
          {target}
        </div>
    )
  }
}
export default Radios;
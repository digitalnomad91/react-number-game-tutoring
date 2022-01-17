const IntButton = (props) => {
    return (
      <span>
        <button key={props.index} index={props.index} className="{props.index % 2 == 0 ? 'evenInt' : 'oddInt'} ml-2 btn btn-outline-secondary" onClick={e => props.clickIntBtn(e, props.index)}>{props.index}</button> 
      </span>
    );
}

export default IntButton
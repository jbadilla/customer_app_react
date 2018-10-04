import React, { Component } from 'react';
// import Page from './Common_header.html';
import logo from './logo.svg';
import './App.css';

import './common.css';
import './common.js';

import './create_customers.css';

// import MaterialIcon, {colorPalette} from 'material-icons-react';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import $ from 'jquery';

// var commonHeader = {__html: Page};

class Header extends Component {
  render() {
    return (
      <div>
        <div className="fixdiv">
          <nav className="navbar navbar-expand-lg mai-sub-header">                
            <div className="container">
              <a href="#" className="navbar-brand"></a>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

class DemandFunction extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      value: null,
    };
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return(
      <div className="form-group inline row">
          <div className="col-12">
              <label className="col-12">Demand Function <sup className="required"></sup></label>
              <div className="col-md-6 col-lg-4">
                <select id="demand_function" className="form-control custom-select" dir="rtl" onChange={() => this.handleChange} required>
                    <option disabled selected>Select demand function</option>            
                    <option value="linear">Linear</option>            
                    <option value="exponential">Exponential</option>  
                </select>
              </div>
          </div>
      </div>
    );
  }
}

class SampleName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
    }
  }

  handleChange(event) {
    this.setState({name: event.target.value});
  }

  render() {
    return(
      <div className="col-sm-6">
          <label className="col-12">Sample Name <sup className="required"></sup></label>
          <div className="col-md-8">
              <input type="text" id="name" placeholder="Enter name" className="form-control form-control-sm" onChange={() => this.handleChange} required/>
          </div>
      </div>
    );
  }
}

class NumSimulations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numSimulations: 0,
    };
  }

  handleChange(event) {
    this.setState({numSimulations: event.target.value});
  }

  render() {
    return(
      <div className="col-sm-6">
          <label className="col-12">Number of P-value Simulation runs<sup className="required"></sup></label>
          <div className="col-md-8">
              <input type="number" id="p-value" placeholder="0" className="form-control form-control-sm" onChange={() => this.handleChange} required/>
          </div>
      </div>
    );
  }
}

class MarketSize extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      size : 0,
    };
  }

  handleChange(event)
  {
    this.setState({size: event.target.value});
  }

  render() {
    return(
      <div className="col-sm-6">
          <label className="col-12">Market Size <sup className="required"></sup></label>
          <div className="col-md-8">
              <input type="number" id="market_size" placeholder="0" className="form-control form-control-sm" onChange={() => this.handleChange} required/>
          </div>
      </div>
    );
  }
}

class NumCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numCustomers : 0,
    };
  }

  handleChange(event)
  {
    this.setState({numCustomers: event.target.value});
  }

  render() {
    return(
      <div className="col-sm-6">
          <label className="col-12">Number of Simulated Customers <sup className="required"></sup></label>
          <div className="col-md-8">
              <input type="number" id="customers_number" placeholder="0" className="form-control form-control-sm" onChange={() => this.handleChange} required/>
          </div>
      </div>
    );
  }
}

class CustomerDescription extends Component {
  constructor(props) {
    super(props);
    this.value = {
      description : "",
    };
  }

  handleChange(event) {
    this.setState({description : event.target.value});
  }

  render() {
    return(
      <div className="col-sm-12">
        <label className="col-12">Description <sup>250 character limit</sup></label>
        <div className="col-lg-6">
          <textarea id="description" className="form-control textarea-form" maxLength="250" placeholder="Enter description" onChange={() => this.handleChange}></textarea>
        </div>
      </div>
    );
  }
}

class Products extends Component {

  constructor(props) {
    super(props);

    this.addProduct = this.addProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateCorrelationMatrix = this.updateCorrelationMatrix.bind(this);

    this.state = {
      products : [
        {
          id : 0,
          value_driver : "",
          attribute: "",
          wtp: 0,
          elasticity: -2,
          cost: 0
        },
      ],
      correlation_matrix : [],
    };
  }

  handleChange(index, prop, val) {
    // alert("index: " + index + " prop: " + prop + " val: " + val);
    var products = this.state.products.slice();
    products[index][prop] = val;
    this.setState({products: products, correlation_matrix: this.state.correlation_matrix});
  }

  deleteProduct(id) {

    var filteredItems = this.state.products.filter(function (item) {
      return (item.id !== id);
    });

    let i = 0;
    filteredItems.forEach((item) => {
      item.id = i;
      i++;
    });

    var corr = this.state.correlation_matrix;
    corr.pop();
    corr.forEach((row) => {
      row.pop();
    });

    this.setState({products: filteredItems, correlation_matrix: corr});

    alert(JSON.stringify(this.state.correlation_matrix));
  }

  addProduct(event) {

    let new_product = {
      id : this.state.products.length,
      value_driver : "",
      attribute: "",
      wtp: 0,
      elasticity: -2,
      cost: 0
    };

    var new_products = this.state.products.slice();
    new_products.push(new_product);

    var corr = this.state.correlation_matrix;
    corr.push([]);

    if (this.state.products.length != 0)
    {
      corr.forEach((row) => {
        for (let i = row.length-1; i < this.state.products.length-1; i++)
        {
          row.push(null);
        }
      });
    }

    this.setState({products: new_products, correlation_matrix: corr});

    alert(JSON.stringify(this.state.correlation_matrix));

    event.preventDefault();
  }

  updateCorrelationMatrix(id, value)
  {
    var rowNum = parseInt(id.split("_")[1]);
    var colNum = parseInt(id.split("_")[2]);

    var corr = this.state.correlation_matrix;
    corr[rowNum][colNum] = parseFloat(value);
    this.setState({products: this.state.products, correlation_matrix: corr});
  }

  render() { 
    return(
      <div>
        <ProductList products={this.state.products} add={this.addProduct} delete={this.deleteProduct} change={this.handleChange} />
        <CorrelationTable products={this.state.products} corrMatrix={this.state.correlation_matrix} update={this.updateCorrelationMatrix} />
        <Bundles />
        <Sales />
      </div>
    );
  }

}

class ProductList extends Component {

  render() {
    return(
      <div className="form-group inline row">
          <div className="col-6">  
              <label className="col-12">Product List <sup className="required"></sup></label>
          </div>
          <div className="col-6">
              <button type="button" className="btn btn-secondary float-right" onClick={this.props.add}>Add Product</button>
          </div>      
          <div className="col-12">
              <table id="customer_products_table" className="table table-fw-widget">
                  <thead>
                      <tr>
                          <th>
                              <strong>Value Driver</strong>
                          </th>
                          <th>
                              <strong>Attribute</strong> <sup className="required"></sup>
                          </th>
                          <th>
                              <strong>WTP</strong> <sup className="required"></sup>
                          </th>
                          <th>
                              <strong>Elasticity</strong> <sup className="required"></sup>
                          </th>
                          <th>
                              <strong>Cost</strong> <sup className="required"></sup>
                          </th>
                          <th>
                              <strong></strong>
                          </th>
                      </tr>
                  </thead>
                  <ProductItems entries={this.props.products} delete={this.props.delete} handleChange={this.props.change}/>
              </table>
          </div>
      </div>
    );
  }
}

class ProductItems extends Component {
  constructor(props) {
    super(props);
    this.createProducts = this.createProducts.bind(this);
  }

  delete(key)
  {
    this.props.delete(key);
  }

  handleChange(event, key, property)
  {
    // alert(key + " " + property);
    this.props.handleChange(key, property, event.target.value);
  }

  createProducts(prod)
  {
    return (
      <tr >
        <td><input type="text" className="form-control form-control-sm" placeholder="Enter value driver" value={prod['value_driver']} onChange={(e) => this.handleChange(e, prod.id, "value_driver")} /></td>
        <td><input type="text" className="form-control form-control-sm" placeholder="Enter attribute" value={prod['attribute']} onChange={(e) => this.handleChange(e, prod.id, "attribute")} required /></td>
        <td><input type="number" step="0.01" className="form-control form-control-sm" placeholder="0" value={prod['wtp']} onChange={(e) => this.handleChange(e, prod.id, "wtp")} required /></td>
        <td><input type="number" step="0.01" className="form-control form-control-sm" placeholder="0" value={prod['elasticity']} onChange={(e) => this.handleChange(e, prod.id, "elasticity")} required /></td>
        <td><input type="number" step="0.01" className="form-control form-control-sm" placeholder="0" value={prod['cost']} onChange={(e) => this.handleChange(e, prod.id, "cost")} required /></td>
        <td><DeleteOutlinedIcon style={{color: '#c31f0c', cursor: 'pointer'}} onClick={() => this.delete(prod.id)}/></td>
      </tr>
    );
  }

  render()
  {
    var todoProducts = this.props.entries;
    // alert(JSON.stringify(todoProducts));
    var listProducts = todoProducts.map(this.createProducts);

    return(
      <tbody id="products_table">
        {listProducts}
      </tbody>
    );
  }
}

class CorrelationTable extends Component {
  constructor(props) {
    super(props);
    this.createHeader = this.createHeader.bind(this);
    this.createRows = this.createRows.bind(this);
  }

  createLabels()
  {
    let products = this.props.products;

    let headerLabels = [];
    let rowData = [];

    for (let i = 0; i < products.length-1; i++)
    {
      let curr = products[i];
      let next = products[i+1];

      let currentLabel = curr['value_driver'] + ": " + curr['attribute'];
      let valueDriver = curr['value_driver'].toLowerCase();
      if (valueDriver == 'none' || valueDriver == '') currentLabel = curr['attribute'];

      let nextLabel = next['value_driver'] + ": " + next['attribute'];
      valueDriver = next['value_driver'].toLowerCase();
      if (valueDriver == 'none' || valueDriver == '') nextLabel = next['attribute'];

      if (nextLabel == ': ') next = ' ';

      headerLabels.push(nextLabel);
      rowData.push({currentLabel: currentLabel, position: i});
    }

    return {headerLabels: headerLabels, rowData: rowData};
  }

  handleChange(event)
  {
    this.props.update(event.target.id, event.target.value);
  }

  createHeader(label)
  {
    return(
      <th className="centered"><strong>{label}</strong></th>
    );
  }

  createRows(row)
  {
    var products = this.props.products;
    var rowComponents = [];
    let tmp_id;

    for (let i = 0; i < products.length-1; i++)
    {
      if (row.position <= i)
      {
        tmp_id = "corr-wtp_" + row.position + "_" + i;
        rowComponents.push(
          <td><input id={tmp_id} type="number" step="0.01" className="form-control form-control-sm" onChange={(e) => this.handleChange(e)}/></td>
        );
      }
      else
      {
        rowComponents.push(
          <td></td>
        ); 
      }
    }

    return(
      <tr>
        <td>{row.currentLabel}</td>
        {rowComponents}
      </tr>
    );
  }

  // createRowCells()
  // {

  // }

  render() {

    var matrix = this.props.corrMatrix;
    var products = this.props.products;
    var labels = this.createLabels();
    console.log(JSON.stringify(labels));

    var colHeaders = labels.headerLabels.map(this.createHeader);
    var rows = labels.rowData.map(this.createRows);

    return(
      <div className="form-group inline row" id="correlation_container"> 
          <div className="col-12">
            <label className="col-12">Correlation of Product WTPs <sup className="required"></sup></label>
            <table id="correlation_table" className="table table-fw-widget">
                <thead>
                  <tr>
                    <th></th>
                    {colHeaders}
                  </tr>
                </thead>
                <tbody id="correlation_rows">
                  {rows}
                </tbody>
            </table>
          </div>
      </div>
    );
  }
}

class Bundles extends Component {
  render() {
    return(
      <div id="bundles" className="form-group inline row">
          <div className="col-6">  
              <label className="col-12">Product Bundles <sup className="required"></sup></label>
          </div>
          <div className="col-6" style={{'marginBottom': '10px'}}>
              <button  type="button" className="btn btn-secondary float-right" id="add-bundle">Add Bundle</button>
          </div>
      </div>
    );
  }
}

class Sales extends Component {
  render() {
    return(
      <div className="form-group inline row">
          <div className="col-6">  
              <label className="col-12">Sales Volumes <sup className="required"></sup></label>
          </div>
          <div className="col-6">
              <button  type="button" className="btn btn-secondary float-right" id="add-sales">Add Store Sales</button>
          </div>      
          <div className="col-12">
              <table className="table table-fw-widget" id="sales_table">
                  <thead>
                      <tr id="sales_header">
                          <th style={{'textAlign':'left !important'}}>
                              <strong>Store</strong>
                          </th>
                          <th style={{'textAlign':'left !important'}}>
                              <strong>Sales Period</strong>
                          </th>
                      </tr>
                  </thead>
                  <tbody id="sales_rows">
                  </tbody>
              </table>
          </div>
      </div>
    );
  }
}

// class CorrelationRow extends Component {

//   render() {

//     return (
//       <tr><td 
//     );
//   }
// }

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="main-content container">
            <div className="row">
                <div className="col-md-9 form">
                    <div className="panel panel-default" style={{ 'textAlign' : 'left' }}>
                        <div className="panel-heading">Create Customer Sample
                            <div className="tools">
                                <form id="excel-form" encType="multipart/form-data">
                                    <div className="form-group">
                                        <input id="excel-upload" type="file" name="file" className="form-control-file"/>
                                    </div>
                                </form>
                            </div>
                        </div>
                            <div className="panel-body">
                                <form id="customer-form">
                                    <div className="form-group inline row">
                                        <SampleName />
                                        <NumSimulations />
                                    </div>
                                    <div className="form-group inline row">
                                        <MarketSize />
                                        <NumCustomers />
                                    </div>
                                    <DemandFunction />
                                    <div className="form-group inline row">
                                      <CustomerDescription />
                                    </div>
                                    <Products />
                                    <div className="form-group inline row">
                                        <div className="col-sm-6 col-lg-8"></div>
                                        <div className="col-sm-6 col-lg-4">
                                            <button type="submit" className="btn btn-primary float-right" id="submit-customer">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default App;

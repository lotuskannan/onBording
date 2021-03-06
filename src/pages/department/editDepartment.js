import React from 'react'
import {
    Input,
    Form,
    Modal,
    Select,
    Button

} from 'antd'
import UrlConstant from '../../Utils/UrlConstant';
import { EncryptDecryptSessionStorageService } from '../../Utils/EncryptDecryptSessionStorageService'
import { GenericApiService } from '../../Utils/GenericService';
const Option = Select.Option;


const FormItem = Form.Item
class EditDepartment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            employeeList:[],
            desCount:0,
            submitBtn:false
        }
    }

    componentDidMount = () => {
        this.getEmployeeDList();
        if(this.props.departmentdata.description!=undefined){
            console.log(this.props.departmentdata.description.length)
           this.setState({desCount:this.props.departmentdata.description.length})
        }
    }

    onCancel = () => {
        this.props.onCancel()
    }
    getEmployeeDList = () => {
        var organisatioId = EncryptDecryptSessionStorageService.getSessionStorage('orgId')
        var url = UrlConstant.getEmpDList + organisatioId
        var payload = ''

        GenericApiService.Post(url, payload).then((response) => {
            this.setState({
                employeeList: response.data
            })
        })

    }
    editDepartmentSave = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var emplyeedetails = this.state.employeeList[values.leadEmail]
                var userId = EncryptDecryptSessionStorageService.getSessionStorage('userId')
                var organisatioId = EncryptDecryptSessionStorageService.getSessionStorage('orgId')
                var url = UrlConstant.addDepartment
                var payload = {
                    "departmentId":this.props.departmentdata.departmentId,
                    "name": values.departmentName,
                    "description": values.description,
                    "leadEmail": (emplyeedetails!=null)?emplyeedetails.emailId:values.leadEmail,
                    "organisationId": organisatioId,
                    "createdBy": userId,
                    "updatedBy": userId,
                    "createdOn": this.props.departmentdata.createdOn,
                    "updatedOn": new Date(),
                    "isActive": true,
                }
                this.setState({
                    submitBtn:true
                });
                GenericApiService.Post(url, payload, true).then((response) => {
                    this.setState({
                        submitBtn:false
                    });
                    if (response.status.success === 'Success') {
                        this.props.onOk()
                    }

                },error=>{
                    this.setState({
                        submitBtn:false
                    });
                })
            }
        })

    }
    onSelectEmp = (e) => {
       if(e){ var emplyeedetails = this.state.employeeList[e]

        this.setState({
            selectedUserName: emplyeedetails.name
        });
    }else{
        this.setState({
            selectedUserName: e
        });
    }
    }
    count(e){
        var val=e.target.value.length
        this.setState({
            desCount:val
        })
      } 
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

        function hasErrors(fieldsError) {
            return Object.keys(fieldsError).some(field => fieldsError[field])
        }

        return (
            <div >
                <Form>
                    <Modal className="role"
                        visible={this.props.showHidePopup}
                        title="Edit Department"
                        onCancel={this.onCancel}
                        onOk={this.editDepartmentSave}
                        // okText="Save"
                        centered
                        keyboard={false}
                        footer={[
                            <Button className="cancel-btn" key="back" shape="round" onClick={this.onCancel}>
                                Cancel
                            </Button>,
                            <Button key="submit" shape="round" loading={this.state.submitBtn}
                           type="primary" onClick={this.editDepartmentSave}
                            disabled={hasErrors(getFieldsError())}>
                                Update
                            </Button>,
                            ]}
                         >
                        
                            <Form hideRequiredMark onSubmit={this.handleSubmit}>
                                
                            <FormItem label="Department Name">
                                    {getFieldDecorator('departmentName', {
                                        initialValue: this.props.departmentdata.name,
                                        rules: [{ required: true, message: 'Please enter  Department name' },
                                        ],
                                    })(
                                        <Input id="department-name" />
                                    )}

                                </FormItem>
                                <Form.Item label="Department Email ID">
                                    {getFieldDecorator('leadEmail', {
                                        initialValue: this.props.departmentdata.leadEmail,
                                        // rules: [{ message: 'Please  select Department email Id' },
                                        // ],
                                    })(
                                        <Select id="emailId" style={{ width: '100%' }} onChange={this.onSelectEmp.bind(this)}>
                                            <Option key={0} value={null}>--</Option>

                                            {this.state.employeeList.map((employee, index) => {
                                                return (
                                                    <Option key={index}
                                                        value={index}>{employee.emailId}</Option>

                                                )
                                                
                                            })}


                                        </Select>
                                    )}
                                </Form.Item>
                                <FormItem label="Description">
                                    {getFieldDecorator('description', {
                                        initialValue: this.props.departmentdata.description,
                                        // rules: [{ required: true, message: 'Please enter description' },
                                        // ],
                                    })(
                                        <Input id="description" maxLength={30}onChange={this.count.bind(this)}/>
                                    )}
                                <p style={{ float: 'right' }} >
                                    {this.state.desCount} /30
                                </p>
                                </FormItem>                                     
                            </Form>                   

                    </Modal>
                </Form>
            </div>

        )
    }
}
const WrappedEditDepartmentForm = Form.create({ name: 'editDepartment' })(EditDepartment);

export default WrappedEditDepartmentForm;

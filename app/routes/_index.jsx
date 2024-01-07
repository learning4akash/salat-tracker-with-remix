import { json } from '@remix-run/node';
import { Button, Form, Input, Select, message } from 'antd';
import {Country} from 'country-state-city';
import { 
  useLoaderData,
  useSubmit, 
  useFetcher,
  useActionData, 
  redirect
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import {getPrayerTimeData, getPrayerTimeCalculationMethods} from '../module/api';
import { storePrayersData, storeUserData} from '../module/db.js';
import { validationAction } from '../utils.js';
import { z } from "zod";
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export const loader = async ({request}) => {
  const countries = await Country.getAllCountries();
  return json({countries , getPrayerCalMethods : await getPrayerTimeCalculationMethods()});
}

const schema = z.object({
  name: z.string({
    required_error: "Name name is required",
    invalid_type_error: " Name must be a string",
  }),
  country: z.string({
    required_error: "Country is required",
    invalid_type_error: " Country must be a string",
  }),
  city: z.string({
    required_error: "City is required",
    invalid_type_error: " City must be a string",
  }),
  mazhab: z.string({
    required_error: "Mazhab is required",
    invalid_type_error: "Mazhab must be a string",
  }),
  salat_method: z.number({
    required_error: "Salat Method is required",
    invalid_type_error: "Method must be a Number",
  }),
})

export const action = async( { request }) => {
    // const { formData, errors } = await validationAction({
    //   request, 
    //   schema
    // })
    // if (errors) return json({ errors }, { status: 400 });
    // const { name, country, city, mazhab, salat_method } = formData;
    const formData = await request.formData();
    const userData = Object.fromEntries(formData);
    const prayerTime = await getPrayerTimeData(userData);
    return json({ userData, prayerTime }) ;
}

export default function App() {
  const [form] = Form.useForm();
  const cityFetcher = useFetcher({ key: 'fetch-cities'});
  // const getPrayerTime     = useFetcher({ key: 'fetch-prayerTime'});
  const submit = useSubmit();
  const data = useActionData();
  const {countries, getPrayerCalMethods} = useLoaderData();
  const [country, setCountry]           = useState([]);
  const [countryCode, setCountryCode]   = useState();
  const [city, setCity]                 = useState([]);
  const [salatMethods, setSalatMethods] = useState([]);
  const [messageApi, contextHolder]     = message.useMessage();
  const [disable, setDisable]           = useState(false);
  const [loadings, setLoadings]         = useState([]);
  
   console.log(data);

  useEffect(() => {
    if (salatMethods) {
        setSalatMethods(Object.values(getPrayerCalMethods.data));
    }  
    setDisable(false);
  }, []);
  // const data = fetcher.data
  // if (data){
  //   console.log( 'hello ', data);
  // } 

  // useEffect(() => {
  //   if (values) {
  //   getPrayerTimeData(values.value)
  //   .then((data) => {
  //     storePrayersData(data);
  //     storeUserData(values.value);
  //     messageApi.info('Data Save successfully');
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //     localStorage.removeItem("prayer");
     
  //   }) 
  //   }
  // })

  useEffect(() => {
      if (cityFetcher.state === 'idle' && cityFetcher?.data?.length) {
        setCity(cityFetcher.data);
      } 
  }, [cityFetcher]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  };

  const onChangeCountry = (value) => {
    if (value) {
      const selectedCountryCode = countries.find(
        (e) => e.name === value
      );
      const isoCode = selectedCountryCode.isoCode; 
      cityFetcher.load(`/cities/${isoCode}`)
      setCountry(value);
      setCountryCode(isoCode);
      form.setFieldValue('city', undefined);
    }
	};

  const onFinish =  (values) => {
    // fetcher.submit(values, { method: "post" });
    // getPrayerTime.load(`/api/${values}`);
    submit(values, { method: "POST" });
  }

  return (
    <>

    <Form
      {...layout}
      form={form}
      name="control-hooks"
      method='post'
      onFinish={onFinish}
      // initialValues={{...userInfo}}
      style={{ maxWidth: 600, margin: "auto", marginTop: "40px" }}
    >
      <Form.Item
        name="name"
        label="Name"
        placeholder="Your Name"
        rules={[
          {
            message: 'please type your name'
          },
        ]}
      >
        <Input  placeholder="Your Name" />
      </Form.Item>
      <Form.Item
          name= "country"
          label= "Country"
          rules={[
            {
              message: "please select your country name"
            },
          ]}
        >
          <Select
            placeholder="Select Your country"
            onChange={onChangeCountry}
            allowClear
            showSearch
          >
            {
              countries.map((value, index) => (
                  <Option key={index} value={value.name}>
                    {value.name}
                </Option>))
            } 
          </Select>
        </Form.Item>
        { city.length ? (<Form.Item
          name="city"
          label="City"
          rules={[
            {
              message: 'please select your city' 
            },
          ]}
        >
          <Select
            placeholder="Select Your City"
            allowClear
            showSearch
          >
             {
              city.map((value, index) => (
                <Option key={index} value={value.name}>
                    {value.name}
                </Option>
            ))
           }
          </Select>
        </Form.Item>) : ""}
         
        <Form.Item
          name="mazhab"
          label="Mazhab"
          rules={[
            {
              message: 'please select your mazhab'
            },
          ]}
        >
          <Select
            placeholder="Select Your Mazhab"
            allowClear
          >
            <Option value="0">Shafi</Option>
            <Option value="1">Hanafi</Option>
            <Option value="2">Maliki</Option>
            <Option value="3">Hanbali</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name= "salat_method"
          label= "Salat Time Calculation Methods"
          
        >
          <Select
            placeholder="Select Your City Salat Time Calculation Methods"
            allowClear
          >
            {
              salatMethods.map((value, index) => (
                  <Option key={index} value={value.id}>
                    {value.name}
                </Option>))
            } 
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button style={{ marginRight:"20px"}} type="primary" htmlType="submit"  loading={loadings[0]} onClick={() => enterLoading(0)}>
            Submit
          </Button>
          <Button htmlType="button" disabled= {disable} >
            Reset
          </Button>
        </Form.Item> 
    </Form>
    </>
  );
}
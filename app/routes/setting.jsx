import { json } from '@remix-run/node';
import { Button, Form, Input, Select, message } from 'antd';
import {Country} from 'country-state-city';

import {
  useLoaderData,
  useSubmit, 
  useFetcher,
  useActionData, 
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getPrayerTimeCalculationMethods, getPrayerTimeData} from '../module/api';
import { getUserData, storeUserData, storePrayersData, getPrayersData } from '../module/db.js';
import { validationAction } from '../utils.js';
import {  z } from "zod";
import { redirect } from '@remix-run/node';
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

const schema = z.object({
  name: z.string({
    required_error: "Name name is required",
    invalid_type_error: " Name must be a string",
  }).min(2),
  country: z.string({
    required_error: "Country is required",
    invalid_type_error: " Country must be a string",
  }),
  city: z.string({
    required_error: "City is required",
    invalid_type_error: " City must be a string",
  }).optional(),
  mazhab: z.string({
    required_error: "Mazhab is required",
    invalid_type_error: "Mazhab must be a string",
  }),
  salat_method: z.number({
    required_error: "Salat Method is required",
    invalid_type_error: "Method must be a string",
  }),
})

export const loader = async () => {
  const countries = await Country.getAllCountries();
  const userData  = getUserData();
  return json(
    {
      userData,
      countries ,
      getPrayerCalMethods : await getPrayerTimeCalculationMethods(),
    }
  );
 }

 export const action = async( { request }) => {
  const { formData, errors } = await validationAction({
    request, 
    schema
  });
  console.log({errors});
  if (errors) return json({ formData, errors });
  const prayerTimeData = await getPrayerTimeData(formData);
  if (formData && prayerTimeData ) {
    storePrayersData(prayerTimeData);
    storeUserData(formData);
    return redirect('/tracker',{
      headers: {
        "Set-Cookie": 1,
      },
    });
  }
}

export default function App() {
  const [form]                          = Form.useForm();
  const cityFetcher                     = useFetcher({ key: 'fetch-cities'});
  const submit                          = useSubmit();
  const [country, setCountry]           = useState([]);
  const [countryCode, setCountryCode]   = useState();
  const [city, setCity]                 = useState([]);
  const [salatMethods, setSalatMethods] = useState([]);
  const [messageApi, contextHolder]     = message.useMessage();
  const [disable, setDisable]           = useState(false);
  const [loading, setLoading]           = useState(true);
  const [loadings, setLoadings]         = useState([]);
  const [userInfo, setUserInfo]         = useState({});
  const actionData                      = useActionData();
  const {countries, getPrayerCalMethods, userData} = useLoaderData();

  useEffect(() => {
    if (salatMethods) {
      setSalatMethods(Object.values(getPrayerCalMethods.data));
    }  
    setDisable(false);
  }, []);

  useEffect(() => {
    if (! Object.keys(userInfo).length) {
      if (userData) {
        const findCountry = countries.find(country => country.name == userData.country);
        if (findCountry) {
          cityFetcher.load(`/cities/${findCountry.isoCode}`);
          setCountryCode(findCountry.isoCode);
        } 
      }
      setUserInfo(userData);
    }
  }, [])

  useEffect(() => { 
      setLoading(true);
      setLoading(false);
  }, []);

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
      setCity([]);
      form.setFieldValue('city', undefined);
    }
	};

  const onFinish =  (values) => {
    console.log("name", values);
    submit(values, { method: "POST", encType:"application/json"});
  }

  return (
    <>
    {contextHolder}
    {!loading && <Form
      {...layout}
      form={form}
      name="control-hooks"
      method='post'
      onFinish={onFinish}
      initialValues={userData}
      style={{ maxWidth: 600, margin: "auto", marginTop: "40px" }}
    >
      <Form.Item
        name="name"
        label="Name"
        placeholder="Your Name"
        rules={[
          {
          },  
        ]}
      >
        <Input  placeholder="Your Name" />
        {actionData?.errors?.name && (<p style={{"color":"red"}}>{actionData?.errors?.name}</p>)}
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
          {actionData?.errors?.country && (<p style={{"color":"red"}}>{actionData?.errors.country}</p>)}
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
          {actionData?.errors?.mazhab && (<p style={{"color":"red"}}>{actionData?.errors.mazhab}</p>)}
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
          {actionData?.errors?.salat_method && (<p style={{"color":"red"}}>{actionData?.errors.salat_method}</p>)}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button style={{ marginRight:"20px"}} type="primary" htmlType="submit"  loading={loadings[0]} onClick={() => enterLoading(0)}>
            Submit
          </Button>
          <Button htmlType="button" disabled= {disable} >
            Reset
          </Button>
        </Form.Item> 
    </Form>}
    </>
  );
}
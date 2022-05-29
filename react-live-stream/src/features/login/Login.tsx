import { ErrorMessage, Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { useStore } from "../../stores/stores";
import * as yup from 'yup';
import MyTextInput from "../../common/form/MyTextInput";

export default function Login() {
    const { userStore } = useStore();
    const schema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
    });

    return (
        <div className="form-signin">
            <Formik
                validationSchema={schema}
                initialValues={{ username: '', password: '', error: null }}
                onSubmit={(value, { setErrors }) => userStore.login(value)
                    .catch(err => setErrors({ error: err }))}
            >
                {({ handleSubmit, isValid, isSubmitting, dirty, errors }) => (
                    <Form style={{ backgroundColor: "white", padding: 10 }}
                        onSubmit={handleSubmit} autoComplete='off'>

                        <MyTextInput name="username" placeholder="Username" label="Username" />
                        <MyTextInput type="password" name="password" placeholder="Password" label="Password" />

                        <ErrorMessage name="error" render={() => <div className="text-danger">{errors.error}</div>} />

                        <Button className="w-100" disabled={isSubmitting || !dirty || !isValid} variant="success" type="submit">
                            {isSubmitting ? 'Loading...' : 'Login'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
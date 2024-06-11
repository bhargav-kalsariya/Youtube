const SUCCESS = (statuscode, data) => {

    return {
        status: 'success',
        statusCode: statuscode,
        result: { data }
    }

}

const ERROR = (statuscode, error) => {

    return {
        status: 'error',
        statusCode: statuscode,
        result: { error }
    }

}

module.exports = { SUCCESS, ERROR }
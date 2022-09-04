/*

 */
module.exports = {
    PATH: {
        USER: ["USER", "/user"],
        TASK: ["TASK", "/task"],
    },
    MSG: {
        EMAL: ' "EMAIL" SHOULD BE UP TO 100 CHARS AND PROPERLY FORMATED, i.e user@host.com ',
        PSWD: ' "PASSWORD" SHOULD CONTAIN: 1 LOWER, UPPER, NUMERIC, SPECIAL CHAR: !@#$%^&* AND BETWEEN 5-50 CHARS',
        ROLE: ' "ROLE" SHOULD EITHER B "HOST / USER"',
        OFST: ' "OFFSET" SHOULD BE BETWEEN 1 - 200 ',
        BLCK: ' "BLOCK" SHOULD BE BETWEEN 1 - 200  ',
        ISDO: ' "IS-DONE" SHOULD SHOULD EITHER BE "TRUE / FALSE" ',
        DESC: ' "DESCRIPTION" SHOULD BE BETWEEN 1 - 300 CHARS ',
        LABL: ' "LABEL" SHOULD BE BETWEEN 1 - 25 CHARS ',
        TSID: ' "TASK-ID" SHOULD BE BETWEEN 1 - 2000  ',
        USID: ' "USER-ID" SHOULD BE BETWEEN 1 - 100  ',
    }

}




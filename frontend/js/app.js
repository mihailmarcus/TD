var app = new Vue({

    el: '#hamming-encoder',
    data: {
        dataBits: [],
        status: '',
        numberOfDataBits: 0
    },
    created: function () {
        this.initDataBits(4);
    },
    methods: {
        initDataBits: function () {
            this.dataBits = [];
            for (var i = 0; i < this.numberOfDataBits; i++) {
                var bit = { data: null };
                this.dataBits.push(bit);
            }
        },
        send: function () {
            if (this.validate(this.dataBits) === true) {
                var encodedMessage = this.encode(this.dataBits);

                return axios.put("http://localhost:3000/message", { bits: encodedMessage }).then(
                    response => (this.status = response.data));
            } else {
                this.status = 'Input is not valid. Please use 0 or 1 as data bit values';
            }
        },

        encode: function (bits) {
            var c = [], v = [];
            var countC = 0; index = 0, pow = 0;
            //Create final vector to get its size
            for (var i = 0; i < this.numberOfDataBits; i++) {
                if (Math.pow(2, pow) == index + 1) {
                    i--;
                    pow++;
                    countC++;
                    v[index] = 0; //Temporary values of c
                }
                else {
                    v[index] = parseInt(bits[i].data); //Write the sequence de bits written by user
                }
                index++;
            }

            var skip, start, pozition, notEnd;
            for (i = 0; i < countC; i++) {
                notEnd = true; //End of vector flag
                skip = Math.pow(2, i); //How many bits to skip
                start = skip - 1; //Where to start in vector
                c[i] = 0;
                while (notEnd) {
                    for (var j = 0; j < skip; j++) {
                        pozition = start + j;
                        if (pozition < v.length) {
                            c[i] += v[pozition];
                        }
                        else {
                            notEnd = false;
                        }
                    }
                    start = pozition + skip + 1; //Next time starts after it skips enough bits
                }
                c[i] = this.parity(c[i]);
                v[skip - 1] = c[i];
            }
            /*
            var c8 = this.parity(parseInt(bits[4].data) + parseInt(bits[5].data) + parseInt(bits[6].data) + parseInt(bits[7].data));
            var c4 = this.parity(parseInt(bits[1].data) + parseInt(bits[2].data) + parseInt(bits[3].data) + parseInt(bits[7].data));
            var c2 = this.parity(parseInt(bits[0].data) + parseInt(bits[2].data) + parseInt(bits[3].data) + parseInt(bits[5].data) + parseInt(bits[6].data));
            var c1 = this.parity(parseInt(bits[0].data) + parseInt(bits[1].data) + parseInt(bits[3].data) + parseInt(bits[4].data) + parseInt(bits[6].data));
            */
            //console.log("Control bits: " + c1 + "," + c2 + "," + c4 + "," + c8);
            console.log("Control bits: " + c);
            console.log("Final vector: " + v);
            //console.log(c1, c2, parseInt(bits[0].data), c4, parseInt(bits[1].data), parseInt(bits[2].data), parseInt(bits[3].data), c8, parseInt(bits[4].data), parseInt(bits[5].data), parseInt(bits[6].data), parseInt(bits[7].data));
            //return [c1, c2, parseInt(bits[0].data), c4, parseInt(bits[1].data), parseInt(bits[2].data), parseInt(bits[3].data), c8, parseInt(bits[4].data), parseInt(bits[5].data), parseInt(bits[6].data), parseInt(bits[7].data)];
            return v;
        },

        parity: function (number) {
            return number % 2;
        },

        validate: function (bits) {
            for (var i = 0; i < bits.length; i++) {
                if (this.validateBit(bits[i].data) === false)
                    return false;
            }
            return true;
        },

        validateBit: function (character) {
            if (character === null) return false;
        }
    }
});

module.exports = function(app, db) {
        var ObjectID = require('mongodb').ObjectID;

        /* GET New User page. */
        app.get('/', function(req, res) {
            res.sendFile('mySpa.html', { root: __dirname });
        });

        app.get('/workList', async function(req, res) {
            try {
                var doc = await db.collection('Work').find().toArray();

                doc.sort(compare);

                res.send(doc);
            } catch (err) {
                console.log('get all failed');
                console.error(err);
            }
        });

        function compare(a, b) {
            if (a.WorkType < b.WorkType) {
                return -1;
            }
            if (a.WorkType > b.WorkType) {
                return 1;
            }
            return 0;
        };


        app.post('/addWork', (req, res) => {
            const work = {
                Name: req.body.Name,
                WorkType: req.body.WorkType,
                DateEntered: req.body.DateEntered,
                Start: req.body.Start,
                End: req.body.End,
                TotalTime: getTotalTime(req.body.Start, req.body.End),
                PerHour: req.body.PerHour,
                TotalPay: getTotalTime(req.body.Start, req.body.End) * req.body.PerHour,
                DateWorked: req.body.DateWorked,
            };
            db.collection('Work').insertOne(work, (err, result) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    res.send(true);
                }
            });
        });

        app.get('/findWork/:id', (req, res) => {
            var workType = { WorkType: req.params.id };
            console.log("this is the workType: " + workType);
            db.collection('Work').findOne(workType, (err, item) => {
                if (err) {
                    console.log(err);
                    res.send({ 'error': 'An error has occurred :(' });
                } else {
                    console.log(item);
                    if (item == null) { // if there is no such name, don;t just crash the client side code
                        item = {
                            Name: "",
                            WorkType: 'no such work type',
                            DateEntered: 0,
                            Start: 0,
                            End: 0,
                            TotalTime: 0,
                            PerHour: 0,
                            TotalPay: 0,
                            DateWorked: ""
                        }
                    }
                    res.send(item);
                }
            });
        });

        app.delete('/deleteWork/:bid', (req, res) => {
            const theWork = req.params.bid;

            //const details = { '_id': new ObjectID(id) };  not using the _id
            const which = { 'WorkType': theWork };
            db.collection('Work').deleteOne(which, (err, item) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred :(' });
                } else {
                    res.send('Work ' + theWork + ' deleted!');
                }
            });
        });

        app.put('/updateWork/:id', (req, res) => {

            let what_id = req.params.id;
            let work = req.body;
            let updateName = work.Name;
            let updateWorkType = work.WorkType;

            let updateStart = work.Start;
            let updateEnd = work.End;
            let updateTotalTime = getTotalTime(work.Start, work.End);
            let updatePerHour = work.PerHour;
            let updateTotalPay = updateTotalTime * work.PerHour;
            let updateDateWorked = work.DateWorked;

            db.collection('Work').updateOne({ WorkType: what_id }, {
                $set: {
                    Name: updateName,
                    WorkType: updateWorkType,
                    Start: updateStart,
                    End: updateEnd,
                    PerHour: updatePerHour,
                    TotalTime: updateTotalTime,
                    TotalPay: updateTotalPay,
                    DateWorked: updateDateWorked


                }
            }, (err, result) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    res.send(work);
                }
            });
        });



        function parseTime(fullTime) {

            let hour = parseFloat(fullTime.substring(0, 2));
            let min = parseFloat(fullTime.substring(3, 5));
            return { hh: hour, mm: min };
        }

        function getTotalTime(start, end) {
            let startObj = parseTime(start);
            let endObj = parseTime(end);
            let totalTime = { hh: 0, mm: 0 };
            let returnTime;

            if (endObj.hh < startObj.hh) {
                endObj.hh += 24;
            }
            if (endObj.mm < startObj.mm) {
                endObj.hh--;
                endObj.mm += 60;
            }
            totalTime.hh = endObj.hh - startObj.hh;
            totalTime.mm = endObj.mm - startObj.mm;
            totalTime.mm = totalTime.mm / 60;

            returnTime = totalTime.hh + totalTime.mm;
            console.log(returnTime);
            return returnTime;
        }
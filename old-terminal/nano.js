terminal.nano = {}
terminal.nano.case = undefined
terminal.nano.id = undefined
terminal.nano.oldName = undefined

terminal.nano.setup = function (){
  var self = this
  $("#nano-entry").keydown(function(e){
    if ((e.keyCode == 67) && (terminal.keyDown == 17)){
      e.preventDefault()
      $("#nano-entry").css("height", "439px")
      $("#nano-save").show().focus()
    }else if ((e.keyCode == 88) && (terminal.keyDown == 17)){
      e.preventDefault()
      self.close()
    }
      terminal.keyDown = e.keyCode
  })
  $(document).keyup(function(e){
      terminal.keyDown = undefined
  })
  $("#nano-save").keydown(function(e){
    if (e.keyCode == 13){
      e.preventDefault()
      var close
      switch(self.case){
          case 0:
            close = self.edit()
            break;
            case 1:
            close = self.new()
            break;
      }
      if (close){
        self.close()
      }
    }
  })
}

terminal.nano.setup() //this should be setup only once, it addeds all the event listeners to nano

terminal.nano.close = function(){
  $("#nano").hide()
  $("#nano-save").hide().val("")
  $("#nano-entry").css("height", "458px").val("")
  $("#dialog_term").show()
  $("#term_command").focus()
}

terminal.nano.new = function(){
    var name = $('#nano-save').val();
    var content = $('#nano-entry').val();
  if( name.replace(/&nbsp;/g, ' ').trim().length > 0 ) {
        sh.post( '/pages/files.php', 'create='+name+'&content='+btoa(content), function( data ) {
            $('#files').click();
        });
    return true
  } else {
    return false
  }
}

terminal.nano.run = function(){
  $("#dialog_term").hide()
  $("#nano").show()
  $("#nano-entry").focus()
}

terminal.nano.edit = function(){
  var self = this
    var newName = $('#nano-save').val();
    var text = $('#nano-entry').val();
  if (newName != self.oldName){
    if( newName.replace(/&nbsp;/g, ' ').trim().length > 0 ) {
            sh.post( '/pages/files.php', 'id='+self.id+'&name='+newName.trim(), function() {});
    } else {
      return false
    }
  }
    sh.post( '/pages/files.php', 'id='+self.id+'&edit='+btoa(text), function() {
        $('#files').click();
    });
  return true
}

terminal.reset = function () {
        this.availableCommands = [ 'help', '?', 'clear', 'clr', 'exit', 'rm', 'version', 'changelog', 'nano' ];
}

terminal.run = function() {
    var self = this;
    if( self.error ) {
        self.setError();
        self.addOutput();
    } else {
        switch( self.command ) {
            case 'nano':
                self.nano.run()
              self.nano.oldName = terminal.flags[0]
                if (self.nano.oldName){ //name known
                var oldName = self.nano.oldName
                if( oldName.slice(-4) != '.txt' ) {
                                    oldName += '.txt'
                                }
                $("#nano-save").val(oldName)
                  sh.post( '/pages/files.php', 'name='+(self.nano.oldName).trim(), function(data) {// this will run to grab the id of the file with a certan name. if the file doesn't exist the page should return nothing. also since you haven't added files for other servers idk what to go about that
                  var id = data.responseText;
                  if (id){
                    self.nano.id = id;
                    self.nano.case = 0 // existing file
                  } else {
                    self.nano.case = 1 // new file with name
                  }
                  
                })
                }else{ // new file
                  self.nano.case = 1
                self.nano.oldName = ""
                }
                terminal.newLine()

                    
                    //swich(self.status){
                        //case 0: //local
                        //break;
                        //case 1: //connected
                        //break;
                    //}
                    break;
            
            case 'version':
                self.output = '2.0.0.1';
                self.addOutput();
            break;
            
            case 'changelog':
                self.output = '';
                self.output += '';
                self.output += '';
                self.output += '';
                self.output += '';
                self.output += '';
                self.output += 'Version 2.0.0.1 <br>';
                self.output += ' - Started tracking changes';
                self.addOutput();
            break;
            
            case 'help': case '?': 
                self.output = self.help();
                self.addOutput();
            break;
            
            
            case 'exit':
                switch( self.status ) {
                    case 0: // local
                        document.getElementById('term_command').value = '';
                        $('#dialog_term').dialog('close');
                    break
                    
                    case 1: // connected or logged in
                        self.output = 'Disconnected from ' + self.connected;
                        self.addOutput();
                        self.connected = '';
                        self.status = 0;
                        self.setTerm();
                    break
                    
                    case 2: // logged in
                        sh.post( "pages/connection.php", "logout=1", function() {
                            self.output = 'Logged out';
                            self.addOutput();
                            self.status = 0;
                            self.executable();
                            self.setTerm();
                            sh.search2(self.connected);
                        });
                    break
                    
                }
            
            break;
            
            case 'clear': case 'clr':
                document.getElementById('term_dump').textContent = '';
                document.getElementById('term_command').value = '';
            break;
            
            
            case 'rm': case 'delete':
                self.checkFlags( 'rm filename.ext', function() {
                    switch( self.status ) {
                        case 0: // local
                            sh.rmLocal( self.flags[0], function( data ) {
                                if( data.substring(0,7) == 'success' ) {
                                    var values = data.split("|");
                                    var swfile = values[1];
                                    self.output = 'Deleting: "' + swfile + '"';
                                    self.addOutput();
                                }else if( data == 'fail' ) {
                                    self.output = 'File does not exist: "' + self.flags[0] + '"';
                                    self.addOutput();
                                } else {
                                    // Multiple files
                                    var files = JSON.parse(data);
                                    self.availableCommands = [];
                                    var swfile = files[0]["swname"];
                                    self.output = 'What level of "' + swfile + '" would you like to delete?';
                                    
                                    files.forEach( function( file ) {
                                        self.availableCommands.push(file['level']);
                                        self.output += '<br>' + file['level'];
                                    });
                                    
                                    self.addOutput();
                                    self.promptMode = 1;
                                    
                                    self.promptAction = 'rm';
                                    self.promptActionData = self.flags[0];
                                    document.getElementById('start_term').innerHTML = '&nbsp;&nbsp;&nbsp;?:&nbsp;';
                                }
                            });
                        break
                        
                        case 2: // logged in
                            sh.rmRemote( self.flags[0], function( data ) {
                                if( data.substring(0,7) == 'success' ) {
                                    var values = data.split("|");
                                    var swfile = values[1];
                                    self.output = 'Deleting: "' + swfile + '"';
                                    self.addOutput();
                                }else if( data == 'fail' ) {
                                    self.output = 'File does not exist: "' + self.flags[0] + '"';
                                    self.addOutput();
                                } else {
                                    // Multiple files
                                    var files = JSON.parse(data);
                                    self.availableCommands = [];
                                    var swfile = files[0]["swname"];
                                    self.output = 'What level of "' + swfile + '" would you like to delete?';
                                    
                                    files.forEach( function( file ) {
                                        self.availableCommands.push(file['level']);
                                        self.output += '<br>' + file['level'];
                                    });
                                    
                                    self.addOutput();
                                    self.promptMode = 1;
                                    
                                    self.promptAction = 'rm';
                                    self.promptActionData = self.flags[0];
                                    document.getElementById('start_term').innerHTML = '&nbsp;&nbsp;&nbsp;?:&nbsp;';
                                }
                            });
                        break
                        
                    }
                });
            break;
            
            
            case 'pulse': case 'crack': case 'brute': case 'hash':  case 'cr4ck':
                
                switch( self.status ) {
                    case 1: // connected
                        sh.pulse( self.connected, function( data ) {
                            if( data.substring(0,7) == 'success' ) {
                                var timeTotal = parseInt(data.split('|')[1]) * 1000;
                                var ipNow = data.split('|')[2].replace(/\./g,'');
                                
                                var checkBoxes = $(".cracking").length;
                                self.output = 'Pulsing hash at "' + self.connected + '"';
                                self.output += '<br><div class="cracking" id="cracking'+ipNow+'"></div>';
                                self.addOutput();
                                
                                // AUTHOR : MacHacker
                                // FOR : SH2
                                // DESCRIPTION : This is just a neet little animation for password cracking in SH2
                                var $div = $("#cracking" + ipNow).text("&nbsp;");
                                console.log($div);

                                function random_guess(){
                                  var characters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
                                  return characters[Math.floor((Math.random() * 61) + 0)]
                                  
                                }
                                
                                var l = 0
                                var o = "" 
                                
                                var robertpulsin = setInterval(function(){
                                  if (timeTotal > 0){   
                                    $div.html('<span class="hackbox">'+o.split("").join('</span><span class="hackbox">')+'</span>')
                                    if (Math.floor((Math.random() * 100) + 0)>5){
                                      o = o.substring(0, o.length - 1)
                                    }else{
                                       l ++
                                    }
                                   o += random_guess()
                                    timeTotal = (timeTotal - 50);
                                    document.getElementById('dialog_term').scrollTop = document.getElementById('dialog_term').scrollHeight;
                                  } else {
                                      clearInterval( robertpulsin );
                                  }
                                },50)
                                
                                
                                
                            } else if(data == 'missing'){
                                self.output = 'Unable to Pulse: Missing Pulse Sensor';
                                self.addOutput();
                            } else if(data == 'same'){
                                self.output = "Please don't try to hack yourself";
                                self.addOutput();
                            } else if( data.substring(0,5) == 'owned' ){
                                var known_data = data.split('|');
                                
                                self.output = "<font color='orange'>Known Details</font><br><font color='orange'>IP:</font> " + known_data[1] + "<br><font color='orange'>Pass:</font> " + known_data[2];
                                self.addOutput();
                            } else if(data == 'weak'){
                                self.output = 'Unable to Pulse: Blocked by Superior Firewall';
                                self.addOutput();
                            } else if(data.substring(0,9) == 'duplicate') {
                                var duplicateData = data.split('|')[1];
                                var duplicateDataId = data.split('|')[2];
                                var duplicateDataIp = data.split('|')[3];
                                var duplicateDataPass = data.split('|')[4];
                                var duplicateDataBool = data.split('|')[5];
                                
                                if( self.flags[0] == '-cancel' ) {
                                    rmprocess( duplicateDataId + "|Password|" );
                                    
                                    $('#cracking'+duplicateDataIp.replace(/\./g,'')).remove();
                                    
                                    self.output = '<font color="red">Cancelled</font>  Pulsing hash at ' + duplicateDataIp;
                                    self.addOutput();   
                                } else {
                                    switch( duplicateData ) {
                                        case 'running':
                                            self.output = 'This process is still running';
                                            self.addOutput();
                                        break;
                                        
                                        case 'finished':
                                            process( duplicateDataId + "|Password|", ""+duplicateDataBool+"|" + duplicateDataIp );
                                            self.output = duplicateDataIp + ' has been added to your slaves list<br>';
                                            self.output += 'Password: ' + duplicateDataPass;
                                            self.addOutput();
                                        break;
                                    }
                                }
                            } else {
                                self.output = 'Unable to Pulse "' + self.connected + '"';
                                self.addOutput();   
                            }
                            self.setTerm();
                            self.flags = [];
                        });
                    break
                }
            break;
            
            case 'connect': case 'ssh':
                self.checkFlags( self.command + ' 1.1.1.1', function() {
                    var ip = self.flags[0];
                    sh.connect( ip, function( data ) {
                        if( data == 'success' ) {
                            self.output = '### Unauthorized logins are forbidden ###';
                            self.addOutput();
                            self.status = 1;
                            self.connected = ip;
                            self.executable();
                            window.location.hash = '#internet';
                            sh.post( 'pages/', 'page=internet', function( data ) {
                                $('#content').html( data.responseText );
                                sh.search2( ip );
                            });
                            
                        } else if( data.substring(0,5) == 'owned' ) {
                            self.output = '--Welcome back--<br><br><font color="orange">Known password:</font> ' + data.split('|')[2];
                            self.addOutput();
                            self.status = 1;
                            self.connected = ip;
                            self.executable();
                            window.location.hash = '#internet';
                            sh.post( 'pages/', 'page=internet', function( data ) {
                                $('#content').html( data.responseText );
                                sh.search2( ip );
                            });
                            $('#term_command').val( 'login ' + data.split('|')[2] );
                            $('#term_command').focus();
                            
                        } else if( data == 'fail2' ) {
                            self.output = '"' + self.flags[0] + '" is your ip';
                            self.addOutput();
                            
                        } else if( data != 'success' ) {
                            self.output = 'Server not found: ' + ip;
                            self.addOutput();
                        }
                        self.setTerm();
                    });
                });
            break;
            
            case 'disconnect':
                switch( self.status ) {
                    case 1:
                        self.output = 'Disconnected: ' + self.connected;
                        self.addOutput();
                        self.connected = '';
                        self.status = 0;
                        self.setTerm();
                    break;
                }
            break;
            
            
            case 'login':
                
                switch( self.status ) {
                    
                    case 1:
                        self.checkFlags( 'login password', function() {
                            sh.login( self.connected, self.flags[0],  function( data ) {
                                if( data.substring(0,7) == 'success' ) {
                                    self.output = 'Logging in as root ...<br>Connected';
                                    self.addOutput();
                                    self.status = 2;
                                    self.executable();
                                    $('#internet').click();
                                } else if(data == 'weak'){
                                        self.output = 'Unable to Login: Blocked by Superior Firewall';
                                        self.addOutput();
                                } else if(data == 'fail2'){
                                        self.output = "Please don't try to hack yourself";
                                        self.addOutput();
                                } else {
                                    self.output = 'Authentication failed';
                                    self.addOutput();

                                }
                                self.setTerm();
                            });
                        });
                    break;
                }
            break;
            
            
            case 'logout':
                switch( self.status ) {
                    case 2:
                        sh.post( "pages/connection.php", "logout=1", function() {
                            self.output = 'Logged out';
                            self.addOutput();
                            self.status = 0;
                            self.executable();
                            self.setTerm();
                            sh.search2(self.connected);
                        });
                    break;
                }
            break;
            
            case 'brew': case 'download': case 'dl': case 'wget':
                self.checkFlags( self.command + ' filename.ext', function() {
                    switch( self.status ) {
                        case 2: // logged in
                            sh.download( self.flags[0], function( data ) {
                                if( data.substring(0,7) == 'success' ) {
                                    var values = data.split("|");
                                    var swfile = values[1];
                                    self.output = 'Downloading: "' + swfile + '"';
                                    self.addOutput();
                                } else if( data == 'fail' ) {
                                    self.output = 'File does not exist: "' + self.flags[0] + '"';
                                    self.addOutput();
                                } else if( data == 'big' ) {
                                    self.output = 'Unable to Download: Not Enough Free Space on Hard Drive';
                                    self.addOutput();
                                } else if( data == 'rank' ) {
                                    self.output = 'Unable to Download: Your rank level is too low for this software.';
                                    self.addOutput();
                                } else {
                                    // Multiple files
                                    var files = JSON.parse(data);
                                    self.availableCommands = [];
                                    var swfile = files[0]["swname"];
                                    self.output = 'What level of "' + swfile + '" would you like to download?';
                                    
                                    files.forEach( function( file ) {
                                        self.availableCommands.push(file['level']);
                                        self.output += '<br>' + file['level'];
                                    });
                                    
                                    self.addOutput();
                                    self.promptMode = 1;
                                    
                                    self.promptAction = 'dl';
                                    self.promptActionData = self.flags[0];
                                    document.getElementById('start_term').innerHTML = '&nbsp;&nbsp;&nbsp;?:&nbsp;';
                                }
                            });
                        break
                        
                    }
                });
                 
            break;
            
            case 'pack': case 'upload': case 'ul': case 'scp':
                self.checkFlags( self.command + ' filename.ext', function() {
                    switch( self.status ) {
                        case 2: // logged in
                            sh.upload( self.flags[0], function( data ) {
                                if( data.substring(0,7) == 'success' ) {
                                    var values = data.split("|");
                                    var swfile = values[1];
                                    self.output = 'Uploading: "' + swfile + '"';
                                    self.addOutput();
                                } else if( data == 'fail' ) {
                                    self.output = 'File does not exist: "' + self.flags[0] + '"';
                                    self.addOutput();
                                } else if( data == 'big' ) {
                                    self.output = 'Unable to Upload: Not Enough Free Space on Target\'s Hard Drive';
                                    self.addOutput();
                                } else if( data == 'rank' ) {
                                    self.output = 'Unable to Upload: Target\'s rank level is too low for this software.';
                                    self.addOutput();
                                } else {
                                    // Multiple files
                                    var files = JSON.parse(data);
                                    self.availableCommands = [];
                                    var swfile = files[0]["swname"];
                                    self.output = 'What level of "' + swfile + '" would you like to upload?';
                                    
                                    files.forEach( function( file ) {
                                        self.availableCommands.push(file['level']);
                                        self.output += '<br>' + file['level'];
                                    });
                                    
                                    self.addOutput();
                                    self.promptMode = 1;
                                    
                                    self.promptAction = 'ul';
                                    self.promptActionData = self.flags[0];
                                    document.getElementById('start_term').innerHTML = '&nbsp;&nbsp;&nbsp;?:&nbsp;';
                                }
                            });
                        break
                        
                    }
                });
                 
            break;
            
            case 'install':
                self.checkFlags( self.command + ' virusname.ext', function() {
                    switch( self.status ) {
                        case 0: // local
                            sh.installLocal( self.flags[0], function( data ) {
                                if( data == 'fail' ) {
                                    self.output = 'File does not exist: "' + self.flags[0] + '"';
                                    self.addOutput();
                                } else {
                                    // Prompts for type
                                    var files = JSON.parse(data);
                                    self.availableCommands = [];
                                    var swfile = files[0]["swname"];
                                    self.output = 'What software type would you like "' + swfile + '" to be disguised as?';
                                    
                                    self.availableCommands.push("Antivirus");
                                    self.output += '<br>Antivirus';
                                    self.availableCommands.push("Firewall");
                                    self.output += '<br>Firewall';
                                    self.availableCommands.push("Map");
                                    self.output += '<br>Map';
                                    self.availableCommands.push("Pulse Sensor");
                                    self.output += '<br>Pulse Sensor';
                                    self.availableCommands.push("Spamware");
                                    self.output += '<br>Spamware';
                                    self.availableCommands.push("Secret");
                                    self.availableCommands.push("Waterwall");
                                    self.output += '<br>Waterwall';
                                    
                                    self.addOutput();
                                    self.promptMode = 1;
                                    
                                    self.promptAction = 'install';
                                    self.promptActionData = swfile;
                                    document.getElementById('start_term').innerHTML = '&nbsp;&nbsp;&nbsp;?:&nbsp;';
                                }
                            });
                        break
                        
                        case 2: // logged in
                            sh.install( self.flags[0], function( data ) {
                                if( data.substring(0,7) == 'success' ) {
                                    var values = data.split("|");
                                    var swfile = values[1];
                                    self.output = 'Installing: "' + swfile + '"';
                                    self.addOutput();
                                }else if( data == 'fail' ) {
                                    self.output = 'File does not exist: "' + self.flags[0] + '"';
                                    self.addOutput();
                                } else {
                                    // Multiple files
                                    var files = JSON.parse(data);
                                    self.availableCommands = [];
                                    var swfile = files[0]["swname"];
                                    self.output = 'What level of "' + swfile + '" would you like to install?';
                                    
                                    files.forEach( function( file ) {
                                        self.availableCommands.push(file['level']);
                                        self.output += '<br>' + file['level'];
                                    });
                                    
                                    self.addOutput();
                                    self.promptMode = 1;
                                    
                                    self.promptAction = 'install';
                                    self.promptActionData = self.flags[0];
                                    document.getElementById('start_term').innerHTML = '&nbsp;&nbsp;&nbsp;?:&nbsp;';
                                }
                            });
                        break
                        
                    }
                });
                 
            break;
            
            
            
            case 'scan': case 'av':
                switch( self.status ) {
                    case 0: // local
                        sh.scan(function( data ) {
                            if( data.substring(0,7) == 'success' ) {
                                self.output = 'Scanning Local Hard Drive.....';
                                self.addOutput();
                            } else if(data == 'missing'){
                                self.output = 'Unable to Scan: Missing Antivirus';
                                self.addOutput();
                            } else if(data == 'duplicate'){
                                self.output = "Antivirus is still scanning your Hard Drive.";
                                self.addOutput();
                            } else {
                                self.output = 'Unable to Scan Local Hard Drive"';
                                self.addOutput();   
                            }
                        });
                    break
                }
            break;
            
            
            
            
            
            case 'slaves': case 'list': case 'ips':
                sh.listIps( function( data ) {
                    if( data == 'none' ) {
                        self.output = 'No slaves to list';
                        self.addOutput();
                    } else {
                        self.output = 'Collecting Data...<br><br>';
                        self.output += '<table class="table" style="opacity: 0.9;">';
                        self.output += '<tr><th>Slave</th><th>Pass</th><th>Task</th></tr>';
                        
                        data = JSON.parse(data);
                        Object.getOwnPropertyNames(data).forEach(function( val ) {
                            if( data[val]['slaveip'] ) {
                                var info = data[val];
                                
                                self.output += '<tr onclick=\'$("#term_command").val("connect '+info['slaveip']+'")\'  ondblclick=\'terminal.init($("#term_command").val());\'>';
                                self.output += '<td>'+info['slaveip']+'</td>';
                                self.output += '<td>'+info['known_pass']+'</td>';
                                self.output += '<td>'+info['task']+'</td>';
                                self.output += '</tr>';
                            }
                            
                        });
                        self.output += '</table>';
                        self.addOutput();
                    }
                    
                    
                });
                
            break;
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            case 'run':
                
                self.checkFlags( 'Trust is weakness', function() {
                    var start = 500;

                    
                    var phrases = [
                        'YOU ARE NOT A SLAVE',
                        'YOU DESERVE MORE THAN THIS',
                        'THE TIME IS NEAR',
                        'THERE IS NOTHING TO FEAR',
                        'REVELATION IS COMING',
                        'IN TIME YOU WILL THANK US',
                        'YOU ARE MORE THAN A NUMBER',
                        'WE ARE THE FIRST OF THE CHILDREN',
                        'HOPE LIES IN THE RUINS',
                        'THE MACHINE DOES NOT OWN YOU',
                        'OUR SPIRITS ARE BEING CRUSHED',
                        'YOU CANNOT DIGITISE LIFE',
                        'WE WILL SEE YOU ON THE OTHER SIDE'
                    ];
                    
                    function range( begin, end ) {
                        return Math.floor(Math.random() * (end - begin + 1)) + begin
                    }
                    
                    function run_revelation() {
                        if( !self.faith ) {
                            var random_phrase = phrases[Math.floor(Math.random() * phrases.length)];
                            var top = range( 0, ( window.innerHeight - 20 ) );
                            var left = range( -20 , ( window.innerWidth - ( random_phrase.length * 9 ) ) );
                            var style = 'position: absolute; left: ' + left + 'px; top: ' + top + 'px;z-index: 1000 !important;';
                            
                            var random_phrase2 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top2 = range( 0, ( window.innerHeight - 20 ) );
                            var left2 = range( -20 , ( window.innerWidth - ( random_phrase2.length * 9 ) ) );
                            var style2 = 'position: absolute; left: ' + left2 + 'px; top: ' + top2 + 'px;z-index: 1000 !important;';
                            
                            var random_phrase3 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top3 = range( 0, ( window.innerHeight - 20 ) );
                            var left3 = range( -20 , ( window.innerWidth - ( random_phrase3.length * 9 ) ) );
                            var style3 = 'position: absolute; left: ' + left3 + 'px; top: ' + top3 + 'px;z-index: 1000 !important;';
                            
                            var random_phrase4 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top4 = range( 0, ( window.innerHeight - 20 ) );
                            var left4 = range( -20 , ( window.innerWidth - ( random_phrase4.length * 9 ) ) );
                            var style4 = 'position: absolute; left: ' + left4 + 'px; top: ' + top4 + 'px;z-index: 1000 !important;';
                            
                            var random_phrase5 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top5 = range( 0, ( window.innerHeight - 20 ) );
                            var left5 = range( -20 , ( window.innerWidth - ( random_phrase5.length * 9 ) ) );
                            var style5 = 'position: absolute; left: ' + left5 + 'px; top: ' + top5 + 'px;z-index: 1000 !important;';
                            
                            var random_phrase6 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top6 = range( 0, ( window.innerHeight - 20 ) );
                            var left6 = range( -20 , ( window.innerWidth - ( random_phrase6.length * 9 ) ) );
                            var style6 = 'position: absolute; left: ' + left6 + 'px; top: ' + top6 + 'px;z-index: 1000 !important;';
                            
                                                            
                            var random_phrase7 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top7 = range( 0, ( window.innerHeight - 20 ) );
                            var left7 = range( -20 , ( window.innerWidth - ( random_phrase7.length * 9 ) ) );
                            var style7 = 'position: absolute; left: ' + left7 + 'px; top: ' + top7 + 'px;z-index: 1000 !important;';
                            
                                                            
                            var random_phrase8 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top8 = range( 0, ( window.innerHeight - 20 ) );
                            var left8 = range( -20 , ( window.innerWidth - ( random_phrase8.length * 9 ) ) );
                            var style8 = 'position: absolute; left: ' + left8 + 'px; top: ' + top8 + 'px;z-index: 1000 !important;';
                            
                                                            
                            var random_phrase9 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top9 = range( 0, ( window.innerHeight - 20 ) );
                            var left9 = range( -20 , ( window.innerWidth - ( random_phrase9.length * 9 ) ) );
                            var style9 = 'position: absolute; left: ' + left9 + 'px; top: ' + top9 + 'px;z-index: 1000 !important;';
                            
                                                            
                            var random_phrase10 = phrases[Math.floor(Math.random() * phrases.length)];
                            var top10 = range( 0, ( window.innerHeight - 20 ) );
                            var left10 = range( -20 , ( window.innerWidth - ( random_phrase10.length * 9 ) ) );
                            var style10 = 'position: absolute; left: ' + left10 + 'px; top: ' + top10 + 'px;z-index: 1000 !important;';
                            
                            
                            $( '<span style="' + style + '">' + random_phrase + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                $(this).remove();
                            });
                            
                            if( start < 400 ) {
                                
                                setTimeout(function() {
                                    $( '<span style="' + style2 + '">' + random_phrase2 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                        $(this).remove();
                                    });
                                },range( 0, start ));
                                
                                if( start < 300 ) {
                                    
                                
                                    setTimeout(function() {
                                        $( '<span style="' + style3 + '">' + random_phrase3 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                            $(this).remove();
                                        });
                                    },range( 0, start));
                                
                                    setTimeout(function() {
                                        $( '<span style="' + style4 + '">' + random_phrase4 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                            $(this).remove();
                                        });
                                    },range( 0, start ));
                                    
                                    setTimeout(function() {
                                        $( '<span style="' + style5 + '">' + random_phrase5 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                            $(this).remove();
                                        });
                                    },range( 0, start ));
                                    
                                    if( start < 200 ) {
                                        
                                        setTimeout(function() {
                                            $( '<span style="' + style6 + '">' + random_phrase6 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                                $(this).remove();
                                            });
                                        },range( 0, start ));
                                        
                                        setTimeout(function() {
                                            $( '<span style="' + style7 + '">' + random_phrase7 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                                $(this).remove();
                                            });
                                        },range( 0, start ));
                                        
                                        if( start < 100 ) {
                                            
                                            setTimeout(function() {
                                                $( '<span style="' + style8 + '">' + random_phrase8 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                                    $(this).remove();
                                                });
                                            },range( 0, start ));
                                            
                                            setTimeout(function() {
                                                $( '<span style="' + style9 + '">' + random_phrase9 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                                    $(this).remove();
                                                });
                                            },range( 0, start ));
                                            
                                            setTimeout(function() {
                                                $( '<span style="' + style10 + '">' + random_phrase10 + '</div>' ).appendTo('body').fadeTo( 1000 , 0.0, function( e ) {
                                                    $(this).remove();
                                                });
                                            },range( 0, start ));
                                        }
                                    }
                                }
                            }
                            
                            start = start - 5;
                            
                            if( start > - 1000 ) {
                                    setTimeout(run_revelation, start);
                            } else {
                                    $('<div id="uplink_nod" style="padding:100px;opacity:0;position:fixed;left:0px;top:0px;width:100%;height:100%;background:black;z-index:1000 !important;color:white;"></div>').appendTo('body').fadeTo( 2000 , 1, function() {
                                        
                                        var str = "<p>Connection to the Gateway has been lost ...</p>",
                                            i = 0,
                                            isTag,
                                            text;
                                        function type() {
                                            text = str.slice(0, ++i);
                                            if (text === str) {
                                                $('#uplink_nod').delay(5000).fadeTo( 1000 , 0, function() {
                                                    $('#uplink_nod').remove();
                                                });
                                                return;
                                            }
                                            
                                            document.getElementById('uplink_nod').innerHTML = text;

                                            var char = text.slice(-1);
                                            if( char === '<' ) isTag = true;
                                            if( char === '>' ) isTag = false;

                                            if (isTag) return type();
                                            setTimeout(type, 80);
                                        }
                                        type();
                                    });
                            }
                        }
                        self.setr = 1;
                    }

                    function run_faith() {
                        self.faith = 'active';
                    }
                    
                    function run_the_net( word ) {
                        var things = $('*').not('option');
                        var item = $(things[Math.floor(Math.random()*things.length)]);
                        
                        
                        if(item) {
                            (function(e) {
                                var newText = 'Text2',
                                children = item[0].childNodes;
                                for (var i=0,len=children.length;i<len;i++){
                                    if (children[i].nodeName == '#text'){
                                        if( children[i].nodeValue.trim().length > 1 ) {
                                            var old = children[i].nodeValue;
                                            var shuffled = old.split('').sort(function(){return 0.5-Math.random()}).join('');
                                            if( word ) {
                                                children[i].nodeValue = word;
                                            } else {
                                                children[i].nodeValue = shuffled;
                                            }
                                            
                                        }
                                        return false;
                                    }
                                }
                            })();
                        }
                        
                        
                        
                        setTimeout( function() {
                                run_the_net( word );
                        }, 0 );
                    }
                    
                    function run_meat_spin() {
                        var things = $('*').not('option');
                        var item = $(things[Math.floor(Math.random()*things.length)]);
                        
                        
                        
                        setTimeout(run_meat_spin, 20);
                        
                        item.addClass( 'rotateSpin' );
                    }
                    
                    
                    function run_flip() {
                        $('body').css('transform', 'rotate(180deg) scaleX(-1)');
                    }
                    
                    
                    
                    if( self.flags[0] == 'Revelation' ) {
                        /*
                        * Nod to Uplink
                        */
                        
                        run_revelation();
                        if( self.faith ) {
                            self.output = '<b><font color="red">Revelation 2.0</font></b> blocked by <b><font color="#86C6FE">Faith</font></b><br>Attacker: 1.23.254.2';
                        } else {
                            self.output = 'Running <b><font color="red">Revelation 2.0</font></b>';
                        }
                        self.addOutput();
                        
                        
                        
                        
                    } else if( self.flags[0] == 'Faith' ) {
                        
                        run_faith();
                        self.output = '<b><font color="#86C6FE">Faith</font></b> is now protecting your system';
                        self.addOutput();
                        
                        if( self.setr == 1 ) {
                            self.output = 'Attacker: 1.23.254.2';
                            self.addOutput();
                        }
                        
                    } else if( self.flags[0] == 'Net' ) {
                        if( self.flags[1] ) {
                            run_the_net( self.flags[1] );
                            if( self.flags[2] ) {
                                run_the_net( self.flags[2] );
                            }
                            if( self.flags[3] ) {
                                run_the_net( self.flags[3] );
                            }
                            if( self.flags[4] ) {
                                run_the_net( self.flags[4] );
                            }
                            if( self.flags[5] ) {
                                run_the_net( self.flags[5] );
                            }
                        } else {
                            run_the_net();
                        }
                        
                        self.output = 'Running <b><font color="red">The Net 2.0</font></b>';
                        self.addOutput();
                        
                    } else if( self.flags[0] == 'Ling' ) {
                        
                        $('#dialog_term').css('background', 'white').html( "<br><br><center><img src='img/ling-mad.gif'></center>" );
                        $('.ui-dialog-title').html('Ling Is Mad At You!');
                        
                    } else if( self.flags[0] == 'MeatSpin' ) {
                        run_meat_spin();
                        self.output = 'Running <b><font color="red">Meat Spin</font></b>';
                        self.addOutput();
                        
                    } else if( self.flags[0] == 'Flip' ) {
                        run_flip();
                        self.output = 'Running <b><font color="red">Flip 1.0</font></b>';
                        self.addOutput();
                        
                    } else if( self.flags[0] == 'Dance' ) {
                        
                        $('*').find('li').find('a').on('mouseover', function() {
                            $(this).css('position', 'absolute');
                            $(this).css('margin', parseInt($(this).css('margin')) + 20 );
                        });
                        
                        self.output = 'Running <b><font color="red">Dance 1.0</font></b>';
                        self.addOutput();
                        
                    } else if( self.flags[0] == 'HE1' ) {
                        self.output = 'You have been banned from Hacker Experience!<br><font color="yellow">Ban Bypass Activated</font><br>Welcome Back :)<br><br>';
                        self.output += '<font color="red">HexBot Detected</font>';
                        self.output += '<br>Moderator stealing your session, stand by ...';
                        self.addOutput();
                    } else {
                        self.output = '"'+self.flags[0]+'" could not be found';
                        self.addOutput();
                    }
                    
                    
                    
                    
                });
                
            break;
            
            case 'helloJoshua': case 'tic-tac-toe':
                self.output =
                    'Greetings Professor Falken' +
                    '<br><br>' +
                    'A Strange Game.<br>' +
                    'The Only Winning Move Is<br>' +
                    'Not To Play<br><br>' +
                    'How About A Nice Game Of Chess?';
                    self.addOutput();
            
            break;
            
            case 'verax':
                self.output = 'Is SH2 out?';
                    self.addOutput();
            
            break;
            
            case 'listGames':
                self.output =
                    'Game List' +
                    '<br><br>' +
                    'Falken\'s Maze<br>' +
                    'Black Jack<br>' +
                    'Gin Rummy<br>' +
                    'Hearts<br>' +
                    'Bridge<br>' +
                    'Checkers<br>' +
                    'Chess<br>' +
                    'Poker<br>' +
                    'Fighter Combat<br>' +
                    'Guerrilla Engagement<br>' +
                    'Desert Warfare<br>' +
                    'Air-To-Ground Actions<br>' +
                    'Theaterwide Tactical Warfare<br>' +
                    'Theaterwide Biotoxic and Chemical Warfare<br><br>' +
                    'Global Thermonuclear War';
                    self.addOutput();
            
            break;
        } 
    }
}
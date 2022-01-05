COMMAND = netstat -vanp tcp | grep <port_number>
EXAMPLE = tcp6       0      0  ::1.64760              ::1.49713              ESTABLISHED 407800 146808  30647      0 0x1103 0x00000104
COMMAND = kill -9 30647
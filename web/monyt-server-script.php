<?php

error_reporting(0);

define( "MONYT_SCRIPT_VERSION", "1.0.1" );

if( isset($_GET['version'] ) )
{
    die( MONYT_SCRIPT_VERSION );
}
else if( isset($_GET['check']) )
{
    $aCheck = array
    (
        'monyt' => MONYT_SCRIPT_VERSION,
        'distro' => '',
        'kernel' => '',
        'cpu' => '',
        'cores' => ''
    );
    
    $sDistroName = '';
    $sDistroVer  = '';

    foreach (glob("/etc/*_version") as $filename) 
    {
        list( $sDistroName, $dummy ) = explode( '_', basename($filename) );

        $sDistroName = ucfirst($sDistroName);
        $sDistroVer  = trim( file_get_contents($filename) );
        
        $aCheck['distro'] = "$sDistroName $sDistroVer";
        break;
    }
    
    if( !$aCheck['distro'] )
    {
        if( file_exists( '/etc/issue' ) )
        {
            $lines = file('/etc/issue');
            $aCheck['distro'] = trim( $lines[0] );
        }
        else
        {
            $output = NULL;
            exec( "uname -om", $output );
            $aCheck['distro'] = trim( implode( ' ', $output ) );
        }
    }
    
    $cpu = file( '/proc/cpuinfo' );
    $vendor = NULL;
    $model = NULL;
    $cores = 0;
    foreach( $cpu as $line )
    {
        if( preg_match( '/^vendor_id\s*:\s*(.+)$/i', $line, $m ) )
        {
            $vendor = $m[1];
        }
        else if( preg_match( '/^model\s+name\s*:\s*(.+)$/i', $line, $m ) )
        {
            $model = $m[1];
        }
        else if( preg_match( '/^processor\s*:\s*\d+$/i', $line ) )
        {
            $cores++;
        }
    }
    
    $aCheck['cpu']    = "$vendor, $model";
    $aCheck['cores']  = $cores;
    $aCheck['kernel'] = trim(file_get_contents("/proc/version"));
    
    die( json_encode($aCheck) );
}

$aStats = array( 'monyt' => MONYT_SCRIPT_VERSION );


$aStats['uptime'] = trim( file_get_contents("/proc/uptime") );

$load = file_get_contents("/proc/loadavg");
$load = explode( ' ', $load );

$aStats['load'] = $load[0].', '.$load[1].', '.$load[2];

$memory = file( '/proc/meminfo' );
foreach( $memory as $line )
{
    $line = trim($line);
    
    if( preg_match( '/^memtotal[^\d]+(\d+)[^\d]+$/i', $line, $m ) )
    {
        $aStats['total_memory'] = $m[1];
    }
    else if( preg_match( '/^memfree[^\d]+(\d+)[^\d]+$/i', $line, $m ) )
    {
        $aStats['free_memory'] = $m[1];
    }
}

$aStats['hd'] = array();

foreach( file('/proc/mounts') as $mount )
{
    $mount = trim($mount);
    if( $mount && $mount[0] == '/' )
    {
        $parts = explode( ' ', $mount );
        if( $parts[0] != $parts[1] )
        {
            $device = $parts[0];
            $folder = $parts[1];
            $total  = disk_total_space($folder) / 1024;
            $free   = disk_free_space($folder) / 1024;

            if( $total > 0 )
            {
                $used   = $total - $free;
                $used_perc = ( $used * 100.0 ) / $total;

                $aStats['hd'][] = array
                (
                    'dev' => $device,
                    'total' => $total,
                    'used' => $used,
                    'free' => $free,
                    'used_perc' => $used_perc,
                    'mount' => $folder
                );
            }
        }
    }
}

$ifname = NULL;

if( file_exists('/etc/network/interfaces') )
{
    foreach( file('/etc/network/interfaces') as $line )
    {
        $line = trim($line);

        if( preg_match( '/^iface\s+([^\s]+)\s+inet\s+.+$/', $line, $m ) && $m[1] != 'lo' )
        {
            $ifname = $m[1];
            break;
        }
    }
}
else
{
    foreach( glob('/sys/class/net/*') as $filename )
    {
        if( $filename != '/sys/class/net/lo' && file_exists( "$filename/statistics/rx_bytes" ) && trim( file_get_contents("$filename/statistics/rx_bytes") ) != '0' )
		{
			$parts = explode( '/', $filename );
            $ifname = array_pop( $parts );
        }
    }
}

if( $ifname != NULL )
{
    $aStats['net_rx'] = trim( file_get_contents("/sys/class/net/$ifname/statistics/rx_bytes") );
    $aStats['net_tx'] = trim( file_get_contents("/sys/class/net/$ifname/statistics/tx_bytes") );
}
else
{
    $aStats['net_rx'] = 
    $aStats['net_tx'] = 0;
}

die( json_encode( $aStats ) );

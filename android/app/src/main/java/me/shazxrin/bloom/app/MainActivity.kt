package me.shazxrin.bloom.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.twotone.Pause
import androidx.compose.material.icons.twotone.Stop
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.FabPosition
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import me.shazxrin.bloom.app.theme.ui.BloomTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BloomTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    TimerScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun TimerScreen(modifier: Modifier = Modifier) {
    Scaffold(
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { /* do something */ },
                expanded = true,
                icon = { Icon(Icons.Filled.Add, "New task") },
                text = { Text(text = "New Task") },
            )
        },
        floatingActionButtonPosition = FabPosition.End,
        content = { paddingValues ->
            Timer(
                modifier = Modifier
                    .consumeWindowInsets(paddingValues)
                    .fillMaxSize()
            )
        }
    )
}

@Composable
fun Timer(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .padding(12.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            modifier = Modifier
                .padding(bottom = 16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Text(fontSize = 72.sp, text = "00")
            Spacer(modifier = Modifier.width(16.dp))
            Text(fontSize = 72.sp, text = "00")
            Spacer(modifier = Modifier.width(16.dp))
            Text(fontSize = 72.sp, text = "00")
        }
        Row(
            modifier = Modifier,
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            FilledTonalIconButton(
                modifier = Modifier
                    .size(54.dp),
                onClick = { /*TODO*/ }
            ) {
                Icon(imageVector = Icons.TwoTone.Pause, contentDescription = "Pause")
            }
            Spacer(modifier = Modifier.width(16.dp))
            FilledTonalIconButton(
                modifier = Modifier
                    .size(54.dp),
                onClick = { /*TODO*/ }
            ) {
                Icon(imageVector = Icons.TwoTone.Stop, contentDescription = "Pause")
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun TimerPreview() {
    BloomTheme {
        Timer()
    }
}
package com.easy_my_puja_partner.easy_my_puja_partner

import android.content.Context
import android.content.Intent

object AppLauncher {
    fun openApp(context: Context) {
        val intent = Intent(context, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        context.startActivity(intent)
    }
}
